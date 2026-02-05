from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import faiss
from api.dashboard_routes import router as dashboard_router


from api.scholar_routes import router as scholar_router
from api.rag_routes import router as rag_router
from api.uploads_routes import router as uploads_router

app = FastAPI(title="Research Assistant API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(scholar_router, prefix="/api/scholar")
app.include_router(rag_router, prefix="/api/rag")
app.include_router(uploads_router, prefix="/api/uploads")
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"status": "Research Assistant backend is running"}
