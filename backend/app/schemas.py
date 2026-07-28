from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DraftBase(BaseModel):
    thread_id: Optional[str] = None
    customer_email: Optional[str] = ""
    customer_name: Optional[str] = ""
    subject: Optional[str] = ""
    customer_message: Optional[str] = ""
    ai_reply: Optional[str] = ""
    intent: Optional[str] = ""
    status: str = "Pending"


class DraftCreate(DraftBase):
    pass


class DraftResponse(DraftBase):
    draft_id: int
    created_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DraftEdit(BaseModel):
    ai_reply: str


class StatsResponse(BaseModel):
    total_drafts: int
    pending_reviews: int
    approved_emails: int
    sent_emails: int
    rejected_emails: int
    edited_emails: int
