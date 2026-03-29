from core.vectorstore import load_index_and_meta
from core.embeddings import embed_query
from core.llm import call_llm


def rag_answer(question, top_k=3):
    index, meta = load_index_and_meta()
    if index is None:
        return {"error": "Index not built yet."}

    q_emb = embed_query(question)
    D, I = index.search(q_emb, top_k)

    context = "\n\n".join([meta[i].get("text", meta[i].get("abstract", "")) for i in I[0]])

    prompt = f"""Answer the following question using ONLY the context provided.
Be concise and direct — answer in 1-3 sentences unless the question asks for more detail.

CONTEXT:
{context}

QUESTION: {question}

ANSWER:"""

    answer = call_llm(prompt)

    return {
        "answer": answer.strip(),
        "sources": [meta[i] for i in I[0]],
    }
