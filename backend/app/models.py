from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base


class EmailDraft(Base):
    __tablename__ = "email_drafts"

    draft_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    thread_id = Column(String(255), nullable=True)
    customer_email = Column(String(255), nullable=False)
    customer_name = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    customer_message = Column(Text, nullable=False)
    ai_reply = Column(Text, nullable=False)
    intent = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)
