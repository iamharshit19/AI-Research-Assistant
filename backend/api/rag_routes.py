from fastapi import APIRouter
from pydantic import BaseModel
from services.llama_service import call_llm

router = APIRouter()  

class AskRequest(BaseModel):
    question: str
    papers: list
    aggregate_summary: str

@router.post("/ask")
def ask(req: AskRequest):
    question = req.question
    papers = req.papers
    agg_summary = req.aggregate_summary

    context = "AGGREGATE SUMMARY:\n" + agg_summary + "\n\n"
    for p in papers:
        context += f"TITLE: {p['title']}\nSUMMARY: {p['summary']}\n\n"

    prompt = f"""
You are an expert research assistant answering based ONLY on the context below.

CONTEXT:
{context}

QUESTION: {question}

Return a 2-3 line answer and cite paper titles.
"""

    answer = call_llm(prompt)

    return {
        "answer": answer,
        "sources": [p["title"] for p in papers[:3]],
    }
