import asyncio
import time
import requests
import faiss
from core.embeddings import embed_texts, embed_query
from core.llm import summarize_paper, async_summarize_paper
from core.vectorstore import save_index, load_index_and_meta

# Simple in-memory cache
_cache = {}
CACHE_TTL = 300  # 5 minutes

SEMANTIC_SCHOLAR_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
FIELDS = "title,abstract,authors,year,citationCount,externalIds,url"

# Map frontend arxiv fields to Semantic Scholar
FIELD_MAP = {
    "cs.LG": "Computer Science",
    "cs.AI": "Computer Science",
    "cs.CV": "Computer Science",
    "cs.CL": "Computer Science",
}

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

def fetch_arxiv(topic, field="cs.LG", max_results=5):
    """Fetch ArXiv papers via Semantic Scholar to bypass ArXiv IP bans."""
    cache_key = f"arxiv:{topic}:{field}"
    cached = _get_cached(cache_key)
    if cached is not None:
        return cached

    print(f"📚 Fetching ArXiv papers via Semantic Scholar: {topic}")

    params = {
        "query": topic,
        "limit": max_results,
        "fields": FIELDS,
        "fieldsOfStudy": FIELD_MAP.get(field, "Computer Science"),
    }

    papers = []
    max_retries = 3
    
    # Wait before request to space out Scholar vs ArXiv requests
    time.sleep(2)

    for attempt in range(max_retries):
        try:
            resp = requests.get(SEMANTIC_SCHOLAR_URL, params=params, timeout=30)

            if resp.status_code == 429:
                wait = [5, 10, 20][attempt]
                print(f"⚠️ Semantic Scholar rate limited on ArXiv search, waiting {wait}s... (attempt {attempt+1}/{max_retries})")
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

                # Build ArXiv PDF link
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
                    "pdf_url": pdf_url,
                })

            print(f"✅ Found {len(papers)} papers")
            _set_cache(cache_key, papers)
            return papers

        except requests.exceptions.Timeout:
            print(f"⚠️ Request timed out (attempt {attempt+1})")
            time.sleep(3)
        except Exception as e:
            print(f"⚠️ Fetch failed: {e}")
            return []

    return []


async def arxiv_search_and_summarize(topic, field="cs.LG", top_k=3, summarize=True):
    papers = fetch_arxiv(topic, field)

    if not papers:
        return {
            "topic": topic,
            "papers": [],
            "summaries": [],
            "aggregate_summary": "No papers found. Please try again."
        }

    texts = [p["title"] + " " + p["abstract"] for p in papers]
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
            s_result = await async_summarize_paper(p["title"], p["abstract"])
            summaries.append(s_result)
            
            entry = p.copy()
            entry["summary"] = s_result
            results.append(entry)
            
            # Small delay between LLM calls to prevent TPM spikes
            await asyncio.sleep(1)
    else:
        results = [p.copy() for p in top_papers]

    aggregate_summary = ""
    if summaries:
        print("🤖 Generating aggregate summary...")
        aggregate_summary = await async_generate_aggregate_summary(topic, summaries)

    return {
        "topic": topic,
        "papers": results,
        "summaries": summaries,
        "aggregate_summary": aggregate_summary
    }


async def async_generate_aggregate_summary(topic, summaries):
    joined = "\n\n".join([f"Paper {i+1}:\n{s}" for i, s in enumerate(summaries)])
    return await async_summarize_paper(
        f"Aggregate summary for: {topic}",
        f"Summarize these papers on \"{topic}\":\n\n{joined}\n\nProvide:\n1. 5-line TLDR\n2. Key contributions (4-6 bullets)\n3. Research gaps\n4. Conclusion"
    )
