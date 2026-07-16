from pydantic import BaseModel
from datetime import date


class InteractionCreate(BaseModel):
    doctor_name: str
    hospital: str
    specialty: str
    interaction_type: str
    interaction_date: date
    notes: str
    follow_up_date: date