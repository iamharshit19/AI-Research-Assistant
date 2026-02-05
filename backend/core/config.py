import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

UPLOADS_FILE = os.path.join(DATA_DIR, "uploads.json")
SUMMARIES_FILE = os.path.join(DATA_DIR, "summaries.json")
GAPS_FILE = os.path.join(DATA_DIR, "gaps.json")
FAISS_INDEX = os.path.join(DATA_DIR, "faiss_index.bin")
META_FILE = os.path.join(DATA_DIR, "papers_meta.pkl")

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3:8b-instruct-q4_0"  # Smaller quantized version for 4GB GPU

EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
