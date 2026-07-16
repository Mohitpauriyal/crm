from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.tools import log_interaction

router = APIRouter()


class InteractionRequest(BaseModel):
    notes: str


@router.post("/log")
def log_interaction_api(request: InteractionRequest):

    summary = log_interaction(request.notes)

    return {
        "success": True,
        "summary": summary
    }