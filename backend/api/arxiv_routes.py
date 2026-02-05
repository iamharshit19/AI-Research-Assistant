from fastapi import APIRouter
from pydantic import BaseModel
from services.arxiv_service import arxiv_search_and_summarize

router = APIRouter()

class ArxivQuery(BaseModel):
    topic: str
    field: str = "cs.LG"
    top_k: int = 5
    summarize: bool = True

@router.post("/search")
def search_arxiv(req: ArxivQuery):
    return arxiv_search_and_summarize(
        topic=req.topic,
        field=req.field,
        top_k=req.top_k,
        summarize=req.summarize
    )
