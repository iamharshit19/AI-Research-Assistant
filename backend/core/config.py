import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

UPLOADS_FILE = os.path.join(DATA_DIR, "uploads.json")
SUMMARIES_FILE = os.path.join(DATA_DIR, "summaries.json")
GAPS_FILE = os.path.join(DATA_DIR, "gaps.json")
FAISS_INDEX = os.path.join(DATA_DIR, "faiss_index.bin")
META_FILE = os.path.join(DATA_DIR, "papers_meta.pkl")

# Groq LLM
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

# Embeddings
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
