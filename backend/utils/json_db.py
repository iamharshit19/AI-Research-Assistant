import json
import os

def read_json(path):
    """Safely read JSON. Returns [] if file doesn't exist or is empty."""
    if not os.path.exists(path):
        return []

    try:
        with open(path, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []


def write_json(path, data):
    """Safely write JSON to the file."""
    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "w") as f:
        json.dump(data, f, indent=2)
