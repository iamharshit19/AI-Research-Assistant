import requests
from core.config import OLLAMA_URL, OLLAMA_MODEL

import faiss

def summarize_paper(title, abstract):
    prompt = f"""
You are a research summarizer. Write a detailed 10–15 line summary explaining:

- Problem
- Approach
- Key contributions
- Results
- Limitations
- Relevance to the topic

Title: {title}

Abstract: {abstract}
"""

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }

    r = requests.post(OLLAMA_URL, json=payload)
    r.raise_for_status()
    return r.json().get("response", "")
