# services/llama_service.py
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3:8b-instruct-q2_K"

def summarize_paper(title: str, abstract: str) -> str:
    prompt = f"""
Summarize the following research content in detail.

Title: {title}

Abstract / Summary: {abstract}

Your output must include:
1. TLDR (2–3 sentences)
2. Key insights (4–6 bullet points)
3. Methods used (if any)
4. Strengths and limitations
5. Why it matters
"""

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }

    res = requests.post(OLLAMA_URL, json=payload)
    res.raise_for_status()

    return res.json().get("response", "").strip()
def call_llm(prompt: str):
    payload = {
        "model": "llama3:8b-instruct-q2_K",
        "prompt": prompt,
        "stream": False
    }

    res = requests.post("http://localhost:11434/api/generate", json=payload)
    res.raise_for_status()

    return res.json().get("response", "")
