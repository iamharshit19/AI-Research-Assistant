from fastapi import APIRouter
from utils.json_db import read_json, write_json

router = APIRouter(prefix="/api", tags=["dashboard"])

HISTORY_FILE = "data/history.json"
SUMMARIES_FILE = "data/summaries.json"
GAPS_FILE = "data/gaps.json"


@router.get("/scholar/history")
def get_history():
    return read_json(HISTORY_FILE)


@router.get("/summaries")
def get_summaries():
    return read_json(SUMMARIES_FILE)


@router.get("/gaps")
def get_gaps():
    return read_json(GAPS_FILE)
