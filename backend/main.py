from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.dashboard_routes import router as dashboard_router
from api.scholar_routes import router as scholar_router
from api.arxiv_routes import router as arxiv_router
from api.rag_routes import router as rag_router
from api.uploads_routes import router as uploads_router
from core.embeddings import get_embedding_model

app = FastAPI(title="Research Assistant API", version="1.0")


@app.on_event("startup")
def preload_models():
    """Eagerly load the embedding model so the first request is fast."""
    print("⏳ Preloading embedding model...")
    get_embedding_model()
    print("✅ Embedding model ready.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(scholar_router, prefix="/api/scholar")
app.include_router(arxiv_router, prefix="/api/arxiv")
app.include_router(rag_router, prefix="/api/rag")
app.include_router(uploads_router, prefix="/api/uploads")
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"status": "Research Assistant backend is running"}
