import asyncio
from groq import Groq
from core.config import GROQ_API_KEY, GROQ_MODEL

_client = None


def get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


def call_llm(prompt: str, max_retries=5) -> str:
    """Generic LLM call via Groq with automatic retries on rate limit."""
    client = get_client()
    
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=2048,
            )
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            err_msg = str(e)
            if "429" in err_msg or "Rate limit" in err_msg:
                wait_time = min(2 * (attempt + 1), 15)  # 2s, 4s, 6s, 8s, 10s
                print(f"⚠️ Groq rate limited (429), waiting {wait_time}s... (attempt {attempt+1}/{max_retries})")
                import time
                time.sleep(wait_time)
                continue
            else:
                print(f"⚠️ Groq API error: {e}")
                raise e
                
    print("❌ Groq API: all retries exhausted")
    return "Error: Generation failed due to API rate limits. Please try again."


async def async_call_llm(prompt: str) -> str:
    """Async wrapper — runs call_llm in a thread for parallel execution."""
    return await asyncio.to_thread(call_llm, prompt)


def summarize_paper(title: str, abstract: str) -> str:
    """Generate a structured research summary."""
    prompt = f"""You are an expert academic research assistant. Provide a detailed summary of the research paper provided below. Do NOT ask for the text, summarize the provided text immediately.

--- RESEARCH PAPER ---
Title: {title}

Abstract / Content: {abstract}
----------------------

Based ONLY on the text above, generate a summary. Your response MUST strictly follow this structure and provide the requested information:
1. TLDR (2-3 sentences)
2. Key insights (4-6 bullet points)
3. Methods used (if any)
4. Strengths and limitations
5. Why it matters
"""
    return call_llm(prompt)


async def async_summarize_paper(title: str, abstract: str) -> str:
    """Async wrapper for parallel summarization."""
    return await asyncio.to_thread(summarize_paper, title, abstract)
