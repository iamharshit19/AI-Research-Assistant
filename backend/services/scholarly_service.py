import asyncio
import faiss
import time
import requests
from core.llm import summarize_paper, async_summarize_paper
from core.embeddings import embed_texts, embed_query
from core.vectorstore import save_index, load_index_and_meta

# Simple in-memory cache
_cache = {}
CACHE_TTL = 300  # 5 minutes

SEMANTIC_SCHOLAR_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
FIELDS = "title,abstract,authors,year,citationCount,externalIds,url"

def _get_cached(key):
    if key in _cache:
        ts, data = _cache[key]
        if time.time() - ts < CACHE_TTL:
            print(f"📦 Cache hit for: {key}")
            return data
        del _cache[key]
    return None

def _set_cache(key, data):
    _cache[key] = (time.time(), data)


def fetch_semantic_scholar(topic, max_results=5, year_low=None, year_high=None):
    """Fetch papers from Semantic Scholar API (free, no scraping)."""
    cache_key = f"scholar:{topic}:{year_low}:{year_high}"
    cached = _get_cached(cache_key)
    if cached is not None:
        return cached

    params = {
        "query": topic,
        "limit": max_results,
        "fields": FIELDS,
    }

    if year_low and year_high:
        params["year"] = f"{year_low}-{year_high}"
    elif year_low:
        params["year"] = f"{year_low}-"
    elif year_high:
        params["year"] = f"-{year_high}"

    print(f"🎓 Fetching Scholar papers: {topic}")
    
    papers = []
    max_retries = 3
    
    # Wait before request to space out requests
    time.sleep(2)

    for attempt in range(max_retries):
        try:
            resp = requests.get(SEMANTIC_SCHOLAR_URL, params=params, timeout=30)

            if resp.status_code == 429:
                wait = [5, 10, 20][attempt]
                print(f"⚠️ Semantic Scholar rate limited, waiting {wait}s... (attempt {attempt+1}/{max_retries})")
                time.sleep(wait)
                continue

            if resp.status_code != 200:
                print(f"⚠️ Semantic Scholar returned status {resp.status_code}")
                return []

            data = resp.json()

            for item in data.get("data", []):
                title = item.get("title", "Untitled")
                abstract = item.get("abstract") or "No abstract available"
                ext_ids = item.get("externalIds", {}) or {}

                authors_list = item.get("authors", [])
                if authors_list:
                    names = [a.get("name", "") for a in authors_list[:3]]
                    authors_str = ", ".join(names)
                    if len(authors_list) > 3:
                        authors_str += " et al."
                else:
                    authors_str = "Unknown"

                year = str(item.get("year") or "Unknown")
                citations = item.get("citationCount", 0) or 0

                arxiv_id = ext_ids.get("ArXiv")
                if arxiv_id:
                    pdf_url = f"https://arxiv.org/pdf/{arxiv_id}"
                elif ext_ids.get("DOI"):
                    pdf_url = f"https://doi.org/{ext_ids['DOI']}"
                else:
                    pdf_url = item.get("url")

                papers.append({
                    "title": title,
                    "abstract": abstract,
                    "authors": authors_str,
                    "year": year,
                    "citations": citations,
                    "pdf_url": pdf_url,
                    "pub_url": item.get("url") or pdf_url,
                })

            print(f"✅ Found {len(papers)} papers from Semantic Scholar")
            _set_cache(cache_key, papers)
            return papers

        except requests.exceptions.Timeout:
            print("⚠️ Semantic Scholar request timed out")
            time.sleep(3)
        except Exception as e:
            print(f"⚠️ Unexpected error: {e}")
            return []
            
    return papers


async def scholar_search_and_summarize(topic, top_k=3, year_low=None, year_high=None, summarize=True):
    """Search Semantic Scholar, rank by relevance, and optionally summarize."""
    papers = fetch_semantic_scholar(topic, max_results=5, year_low=year_low, year_high=year_high)

    if not papers:
        return {
            "topic": topic,
            "papers": [],
            "summaries": [],
            "aggregate_summary": "No papers found for this search.",
        }

    texts = [f"{p['title']} {p['abstract']}" for p in papers]
    embeddings = embed_texts(texts)

    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)

    q_emb = embed_query(topic)
    D, I = index.search(q_emb, min(top_k, len(papers)))

    top_papers = [papers[idx] for idx in I[0]]
    results = []
    summaries = []

    if summarize:
        # Generate summaries sequentially (chunked) to avoid Groq TPM limits
        print("🤖 Generating individual paper summaries...")
        for p in top_papers:
            try:
                s_result = await async_summarize_paper(p["title"], p["abstract"])
                entry = p.copy()
                entry["summary"] = s_result
                summaries.append(s_result)
                results.append(entry)
            except Exception as e:
                print(f"Error generating summary: {e}")
                entry = p.copy()
                entry["summary"] = f"Summary generation failed: {str(e)}"
                results.append(entry)
                
            # Small delay between LLM calls
            await asyncio.sleep(1)
    else:
        results = [p.copy() for p in top_papers]

    aggregate_summary = ""
    if summaries:
        print("🤖 Generating aggregate summary...")
        try:
            aggregate_summary = await async_generate_aggregate_summary(topic, summaries)
        except Exception as e:
            print(f"Error generating aggregate summary: {e}")
            aggregate_summary = "Aggregate summary generation failed."

    return {
        "topic": topic,
        "papers": results,
        "summaries": summaries,
        "aggregate_summary": aggregate_summary,
    }


async def async_generate_aggregate_summary(topic, summaries):
    joined = "\n\n".join(
        [f"Paper {i+1}:\n{summary}" for i, summary in enumerate(summaries)]
    )

    prompt_title = f"Aggregate summary for topic: {topic}"
    prompt_abstract = f"""
Below are summaries of the top papers on the topic "{topic}":

{joined}

Please analyze all summaries and produce a single consolidated literature overview with:
1. 5-line TLDR
2. Key contributions across all papers (4–6 bullet points)
3. Research gaps and future directions
4. Overall conclusion
"""

    return await async_summarize_paper(prompt_title, prompt_abstract)
