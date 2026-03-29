from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.scholarly_service import scholar_search_and_summarize

router = APIRouter()


class ScholarQuery(BaseModel):
    topic: str
    top_k: int = 3
    year_low: Optional[int] = None
    year_high: Optional[int] = None
    summarize: bool = True


@router.post("/search")
async def search_scholar(req: ScholarQuery):
    """Search Google Scholar and return top papers with summaries."""
    return await scholar_search_and_summarize(
        topic=req.topic,
        top_k=req.top_k,
        year_low=req.year_low,
        year_high=req.year_high,
        summarize=req.summarize
    )
