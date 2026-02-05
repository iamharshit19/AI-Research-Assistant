import faiss
import pickle
import os
import faiss


from core.config import FAISS_INDEX, META_FILE


def save_index(index, meta):
    faiss.write_index(index, FAISS_INDEX)
    with open(META_FILE, "wb") as f:
        pickle.dump(meta, f)


def load_index_and_meta():
    if not (os.path.exists(FAISS_INDEX) and os.path.exists(META_FILE)):
        return None, None

    try:
        index = faiss.read_index(FAISS_INDEX)
        with open(META_FILE, "rb") as f:
            meta = pickle.load(f)
        return index, meta
    except Exception as e:
        print(f"Error loading FAISS index (possibly corrupted): {e}")
        print("Deleting corrupted index files and creating fresh index...")
        # Remove corrupted files
        try:
            if os.path.exists(FAISS_INDEX):
                os.remove(FAISS_INDEX)
            if os.path.exists(META_FILE):
                os.remove(META_FILE)
        except Exception as cleanup_error:
            print(f"Error cleaning up corrupted files: {cleanup_error}")
        return None, None
