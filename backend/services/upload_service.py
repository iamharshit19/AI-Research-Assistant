import uuid
import os
from datetime import datetime
from fastapi import UploadFile

from core.file_store import read_json, write_json
from core.config import UPLOADS_FILE, SUMMARIES_FILE, DATA_DIR
from core.embeddings import embed_texts
from core.vectorstore import load_index_and_meta, save_index
from services.llama_service import call_llm

import faiss
import pickle


def extract_text_from_file(file: UploadFile, file_path: str) -> str:
    """Extract text content from uploaded file."""
    filename = file.filename.lower()
    
    if filename.endswith('.txt'):
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    elif filename.endswith('.pdf'):
        try:
            import PyPDF2
        except ImportError:
            raise ImportError("PDF extraction requires PyPDF2. Please install it with: pip install PyPDF2")
        
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            if not text.strip():
                raise ValueError("PDF appears to be empty or text could not be extracted")
            return text
    elif filename.endswith(('.doc', '.docx')):
        try:
            import docx
        except ImportError:
            raise ImportError("DOCX extraction requires python-docx. Please install it with: pip install python-docx")
        
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        if not text.strip():
            raise ValueError("DOCX appears to be empty or text could not be extracted")
        return text
    else:
        # Try to read as text
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            if not content.strip():
                raise ValueError("File appears to be empty")
            return content


def generate_summary(text: str, filename: str) -> str:
    """Generate summary using LLM."""
    # Truncate text if too long (LLM context limit)
    max_chars = 8000
    truncated_text = text[:max_chars] if len(text) > max_chars else text
    
    prompt = f"""Summarize the following document comprehensively.

Document: {filename}

Content:
{truncated_text}

Provide:
1. TLDR (2-3 sentences)
2. Key points (4-6 bullet points)
3. Main topics covered
4. Notable insights or conclusions
"""
    
    try:
        summary = call_llm(prompt)
        return summary
    except Exception as e:
        return f"Summary generation failed: {str(e)}"


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """Split text into overlapping chunks for embedding."""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    
    return chunks if chunks else [text[:1000]]  # At least one chunk


def add_to_vector_store(doc_id: str, chunks: list, filename: str):
    """Add document chunks to FAISS vector store."""
    try:
        # Load existing index or create new one
        index, meta = load_index_and_meta()
        
        if index is None:
            # Create new index
            embeddings = embed_texts(chunks)
            dim = embeddings.shape[1]
            index = faiss.IndexFlatIP(dim)
            index.add(embeddings)
            meta = [{"doc_id": doc_id, "chunk_idx": i, "text": c, "filename": filename} 
                    for i, c in enumerate(chunks)]
        else:
            # Add to existing index
            embeddings = embed_texts(chunks)
            index.add(embeddings)
            new_meta = [{"doc_id": doc_id, "chunk_idx": i, "text": c, "filename": filename} 
                        for i, c in enumerate(chunks)]
            meta.extend(new_meta)
        
        save_index(index, meta)
        return len(chunks)
    except Exception as e:
        print(f"Vector store error: {e}")
        return 0


async def process_upload(file: UploadFile):
    """Process uploaded file: save, extract text, summarize, and index."""
    doc_id = str(uuid.uuid4())
    
    # Create uploads directory if not exists
    uploads_dir = os.path.join(DATA_DIR, "uploaded_files")
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Save file to disk
    file_path = os.path.join(uploads_dir, f"{doc_id}_{file.filename}")
    content = await file.read()
    with open(file_path, 'wb') as f:
        f.write(content)
    
    # Reset file position for any additional reads
    await file.seek(0)
    
    # Extract text - this will raise exceptions if there are errors
    try:
        text = extract_text_from_file(file, file_path)
    except (ImportError, ValueError) as e:
        # Clean up the uploaded file
        os.remove(file_path)
        raise Exception(f"Failed to process file: {str(e)}")
    
    # Validate text content
    if not text or len(text.strip()) < 10:
        os.remove(file_path)
        raise Exception("Document content is too short or empty")
    
    # Generate summary
    summary = generate_summary(text, file.filename)
    
    # Chunk and add to vector store
    chunks = chunk_text(text)
    num_chunks = add_to_vector_store(doc_id, chunks, file.filename)
    
    # Save upload metadata
    uploads = read_json(UPLOADS_FILE)
    uploads.append({
        "id": doc_id,
        "title": file.filename,
        "source": "upload",
        "uploadedAt": datetime.now().isoformat(),
        "chunks": num_chunks,
        "filePath": file_path,
    })
    write_json(UPLOADS_FILE, uploads)
    
    # Save summary
    summaries = read_json(SUMMARIES_FILE)
    summaries.append({
        "id": str(uuid.uuid4()),
        "doc_id": doc_id,
        "title": file.filename,
        "text": summary,
        "date": datetime.now().isoformat(),
        "score": 0.9,  # Confidence placeholder
    })
    write_json(SUMMARIES_FILE, summaries)
    
    return {
        "message": "File processed successfully",
        "id": doc_id,
        "filename": file.filename,
        "summary": summary,
        "chunks": num_chunks,
    }
