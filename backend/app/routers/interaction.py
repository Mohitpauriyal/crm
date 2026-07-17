from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models import Interaction
from sqlalchemy import or_
from sqlalchemy import func
from app.ai.tools import chat_with_ai
#-----for excel file
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from app.ai.tools import (
    log_interaction,
    edit_interaction,
    search_interaction,
    followup_recommendation,
    interaction_insights,
    chat_with_ai,
)

class EditRequest(BaseModel):
    old_text: str
    instruction: str

class SearchRequest(BaseModel):
    query: str

class FollowupRequest(BaseModel):
    summary: str

class InsightRequest(BaseModel):
    data: str
router = APIRouter()

class ChatRequest(BaseModel):
    question: str

class InteractionRequest(BaseModel):
    doctor_name: str
    hospital: str
    specialty: str
    interaction_type: str
    interaction_date: str
    notes: str
    follow_up_date: str
    
    
class UpdateRequest(BaseModel):
    doctor_name: str
    hospital: str
    specialty: str
    interaction_type: str
    interaction_date: str
    notes: str
    follow_up_date: str

@router.post("/log")
def log_interaction_api(
    request: InteractionRequest,
    db: Session = Depends(get_db)
):
    full_notes = f"""
Doctor: {request.doctor_name}
Hospital: {request.hospital}
Specialty: {request.specialty}
Interaction Type: {request.interaction_type}
Interaction Date: {request.interaction_date}

Notes:
{request.notes}

Follow Up:
{request.follow_up_date}
"""

    print("STEP 1")
    summary = log_interaction(full_notes)
    print("STEP 2")

    interaction = Interaction(
        doctor_name=request.doctor_name,
        hospital=request.hospital,
        specialty=request.specialty,
        interaction_type=request.interaction_type,
        interaction_date=date.fromisoformat(request.interaction_date),
        notes=request.notes,
        summary=summary,
        follow_up_date=date.fromisoformat(request.follow_up_date),
    )

    print("STEP 3")

    db.add(interaction)
    print("STEP 4")

    db.commit()
    print("STEP 5")

    db.refresh(interaction)
    print("STEP 6")

    return {
        "success": True,
        "summary": summary,
        "id": interaction.id
    }
    
    
@router.post("/search")
def search_api(
    request: SearchRequest,
    db: Session = Depends(get_db)
):

    interactions = db.query(Interaction).filter(
        or_(
            Interaction.doctor_name.ilike(f"%{request.query}%"),
            Interaction.hospital.ilike(f"%{request.query}%"),
            Interaction.specialty.ilike(f"%{request.query}%"),
            Interaction.notes.ilike(f"%{request.query}%")
        )
    ).all()

    return interactions

# -----------------------------
# Tool 2 : Edit Interaction
# -----------------------------
@router.post("/edit")
def edit_interaction_api(request: EditRequest):

    result = edit_interaction(
        request.old_text,
        request.instruction
    )

    return {
        "success": True,
        "updated_text": result
    }

# -----------------------------
# Tool 4 : Follow-up Recommendation
# -----------------------------
@router.post("/followup")
def followup_api(request: FollowupRequest):

    result = followup_recommendation(request.summary)

    return {
        "success": True,
        "recommendation": result
    }


# -----------------------------
# Tool 5 : Interaction Insights
# -----------------------------
@router.post("/insights")
def insights_api(request: InsightRequest):

    result = interaction_insights(request.data)

    return {
        "success": True,
        "insights": result
    }

# -----------------------------
# Tool 6 : Update Interaction
# -----------------------------
@router.put("/update/{interaction_id}")
def update_interaction(
    interaction_id: int,
    request: UpdateRequest,
    db: Session = Depends(get_db)
):
    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()

    if not interaction:
        return {
            "success": False,
            "message": "Interaction not found"
        }

    full_notes = f"""
Doctor: {request.doctor_name}
Hospital: {request.hospital}
Specialty: {request.specialty}
Interaction Type: {request.interaction_type}
Interaction Date: {request.interaction_date}

Notes:
{request.notes}

Follow Up:
{request.follow_up_date}
"""

    summary = log_interaction(full_notes)

    interaction.doctor_name = request.doctor_name
    interaction.hospital = request.hospital
    interaction.specialty = request.specialty
    interaction.interaction_type = request.interaction_type
    interaction.interaction_date = date.fromisoformat(request.interaction_date)
    interaction.notes = request.notes
    interaction.summary = summary
    interaction.follow_up_date = date.fromisoformat(request.follow_up_date)

    db.commit()
    db.refresh(interaction)

    return {
        "success": True,
        "message": "Interaction updated successfully",
        "summary": summary
    }

# -----------------------------
# Tool 7 : Delete Interaction
# -----------------------------
@router.delete("/delete/{interaction_id}")
def delete_interaction(
    interaction_id: int,
    db: Session = Depends(get_db)
):
    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()

    if not interaction:
        return {
            "success": False,
            "message": "Interaction not found"
        }

    db.delete(interaction)
    db.commit()

    return {
        "success": True,
        "message": "Interaction deleted successfully"
    }
    
# -----------------------------
# Tool 8 : Dashboard Analytics
# -----------------------------
@router.get("/analytics")
def analytics(db: Session = Depends(get_db)):

    total_interactions = db.query(Interaction).count()

    total_doctors = db.query(
        func.count(func.distinct(Interaction.doctor_name))
    ).scalar()

    total_visits = db.query(Interaction).filter(
        Interaction.interaction_type == "Visit"
    ).count()

    total_calls = db.query(Interaction).filter(
        Interaction.interaction_type == "Call"
    ).count()

    total_emails = db.query(Interaction).filter(
        Interaction.interaction_type == "Email"
    ).count()

    return {
        "total_doctors": total_doctors,
        "total_interactions": total_interactions,
        "visits": total_visits,
        "calls": total_calls,
        "emails": total_emails,
    }

@router.post("/chat")
def chat_api(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    interactions = db.query(Interaction).all()

    answer = chat_with_ai(
        request.question,
        interactions
    )

    return {
        "answer": answer
    }

# -----------------------------
# Tool 9 : AI Chat
# -----------------------------
@router.post("/chat")
def chat_api(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    interactions = db.query(Interaction).all()

    answer = chat_with_ai(
        request.question,
        interactions
    )

    return {
        "answer": answer
    }


#---------------------------
# tool 10 : History api
#---------------------------
@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    interactions = db.query(Interaction).order_by(
        Interaction.id.desc()
    ).all()

    return interactions

#------export pdf
@router.get("/export/pdf")
def export_pdf(db: Session = Depends(get_db)):

    interactions = db.query(Interaction).all()

    pdf_file = "interaction_report.pdf"

    doc = SimpleDocTemplate(pdf_file)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(Paragraph("<b>AI CRM Interaction Report</b>", styles["Heading1"]))

    for item in interactions:

        elements.append(
            Paragraph(
                f"""
<b>Doctor:</b> {item.doctor_name}<br/>
<b>Hospital:</b> {item.hospital}<br/>
<b>Specialty:</b> {item.specialty}<br/>
<b>Interaction:</b> {item.interaction_type}<br/>
<b>Date:</b> {item.interaction_date}<br/>
<b>Follow Up:</b> {item.follow_up_date}<br/>
<b>Notes:</b> {item.notes}<br/>
<b>Summary:</b> {item.summary}<br/><br/>
""",
                styles["BodyText"],
            )
        )

    doc.build(elements)

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename="Interaction_Report.pdf",
    )