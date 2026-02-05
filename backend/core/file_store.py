import json
import os
import faiss

def read_json(path):
    if not os.path.exists(path):
        return []
    try:
        with open(path, "r") as f:
            content = f.read().strip()
            if not content:
                return []
            return json.loads(content)
    except json.JSONDecodeError:
        return []

def write_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
