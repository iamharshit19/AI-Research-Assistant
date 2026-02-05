from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.upload_service import process_upload
from services.rag_service import rag_answer

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str
    doc_id: str = None  # Optional: filter to specific document


@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file, extract text, generate summary, and index for Q&A."""
    try:
        result = await process_upload(file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask")
async def ask_document_question(req: QuestionRequest):
    """Ask a question about uploaded documents using RAG."""
    try:
        result = rag_answer(req.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
