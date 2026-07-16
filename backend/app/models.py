from sqlalchemy import Column, Integer, String, Text, Date
from .database import Base


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)

    doctor_name = Column(String(100))

    hospital = Column(String(200))

    specialty = Column(String(100))

    interaction_type = Column(String(50))

    interaction_date = Column(Date)

    notes = Column(Text)

    summary = Column(Text)

    follow_up_date = Column(Date)