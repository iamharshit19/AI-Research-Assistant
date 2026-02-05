from core.vectorstore import load_index_and_meta
from core.embeddings import embed_query
from core.summarizer import summarize_paper

import faiss

def rag_answer(question, top_k=3):
    index, meta = load_index_and_meta()
    if index is None:
        return {"error": "Index not built yet."}

    q_emb = embed_query(question)
    D, I = index.search(q_emb, top_k)

    context = "\n\n".join([meta[i]["abstract"] for i in I[0]])

    summary = summarize_paper(
        f"Answer this question: {question}",
        f"Context: {context}"
    )

    return {
        "answer": summary,
        "sources": [meta[i] for i in I[0]],
    }
