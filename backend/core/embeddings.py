import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from core.config import EMBED_MODEL

_model = None

def get_embedding_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(EMBED_MODEL)
    return _model


def embed_texts(texts):
    model = get_embedding_model()
    emb = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    faiss.normalize_L2(emb)
    return emb


def embed_query(text):
    model = get_embedding_model()
    emb = model.encode([text], convert_to_numpy=True)
    faiss.normalize_L2(emb)
    return emb
