import time
import xml.etree.ElementTree as ET
import requests
import faiss
from services.llama_service import summarize_paper
from core.embeddings import embed_texts, embed_query
from core.vectorstore import save_index, load_index_and_meta
from core.summarizer import summarize_paper
def fetch_arxiv(topic, field="cs.LG", max_results=40):
    topic = topic.replace(" ", "+")
    url = (
        "https://export.arxiv.org/api/query?"
        f"search_query=cat:{field}+AND+all:\"{topic}\""
        "&start=0&max_results=40"
        "&sortBy=relevance&sortOrder=descending"
    )

    resp = requests.get(url)
    root = ET.fromstring(resp.text)

    papers = []
    for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
        title = entry.find("{http://www.w3.org/2005/Atom}title").text.strip()
        abstract = entry.find("{http://www.w3.org/2005/Atom}summary").text.strip()

        pdf = None
        for l in entry.findall("{http://www.w3.org/2005/Atom}link"):
            if l.attrib.get("type") == "application/pdf":
                pdf = l.attrib["href"]

        papers.append({
            "title": title,
            "abstract": abstract,
            "pdf_url": pdf,
        })

    return papers


def arxiv_search_and_summarize(topic, field="cs.LG", top_k=5, summarize=True):
    papers = fetch_arxiv(topic, field)
    texts = [p["title"] + " " + p["abstract"] for p in papers]

    # embeddings
    embeddings = embed_texts(texts)

    # build index
    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)

    # query embedding
    q_emb = embed_query(topic)
    D, I = index.search(q_emb, top_k)

    results = []
    summaries = []

    for idx in I[0]:
        p = papers[idx]
        entry = p.copy()

        if summarize:
            summary = summarize_paper(p["title"], p["abstract"])
            entry["summary"] = summary
            summaries.append(summary)

        results.append(entry)

    # NEW — aggregate summary
    aggregate_summary = generate_aggregate_summary(topic, summaries)

    return {
        "topic": topic,
        "papers": results,
        "summaries": summaries,
        "aggregate_summary": aggregate_summary
    }

   
def generate_aggregate_summary(topic, summaries):
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

    return summarize_paper(prompt_title, prompt_abstract)

