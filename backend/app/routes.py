from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from typing import Optional, List

from .database import get_db
from .models import EmailDraft
from .schemas import DraftResponse, DraftEdit, StatsResponse

router = APIRouter(prefix="/api")


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Return dashboard statistics."""
    total = db.query(func.count(EmailDraft.draft_id)).scalar()
    pending = db.query(func.count(EmailDraft.draft_id)).filter(EmailDraft.status == "Pending").scalar()
    approved = db.query(func.count(EmailDraft.draft_id)).filter(EmailDraft.status == "Approved").scalar()
    sent = db.query(func.count(EmailDraft.draft_id)).filter(EmailDraft.status == "Sent").scalar()
    rejected = db.query(func.count(EmailDraft.draft_id)).filter(EmailDraft.status == "Rejected").scalar()
    edited = db.query(func.count(EmailDraft.draft_id)).filter(EmailDraft.status == "Edited").scalar()
    return StatsResponse(
        total_drafts=total,
        pending_reviews=pending,
        approved_emails=approved,
        sent_emails=sent,
        rejected_emails=rejected,
        edited_emails=edited,
    )


@router.get("/drafts", response_model=List[DraftResponse])
def get_drafts(
    status: Optional[str] = Query(None),
    intent: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Return all drafts with optional filtering and search."""
    query = db.query(EmailDraft)

    if status:
        query = query.filter(EmailDraft.status == status)
    if intent:
        query = query.filter(EmailDraft.intent == intent)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (EmailDraft.customer_name.ilike(search_term))
            | (EmailDraft.customer_email.ilike(search_term))
            | (EmailDraft.subject.ilike(search_term))
        )

    drafts = query.order_by(EmailDraft.created_at.desc()).all()
    return drafts


@router.get("/drafts/{draft_id}", response_model=DraftResponse)
def get_draft(draft_id: int, db: Session = Depends(get_db)):
    """Return a single draft by ID."""
    draft = db.query(EmailDraft).filter(EmailDraft.draft_id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    return draft


@router.put("/drafts/{draft_id}/approve", response_model=DraftResponse)
def approve_draft(draft_id: int, db: Session = Depends(get_db)):
    """Approve a draft - sets status to Approved and approved_at to now."""
    draft = db.query(EmailDraft).filter(EmailDraft.draft_id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    draft.status = "Approved"
    draft.approved_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(draft)
    return draft


@router.put("/drafts/{draft_id}/reject", response_model=DraftResponse)
def reject_draft(draft_id: int, db: Session = Depends(get_db)):
    """Reject a draft - sets status to Rejected."""
    draft = db.query(EmailDraft).filter(EmailDraft.draft_id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    draft.status = "Rejected"
    db.commit()
    db.refresh(draft)
    return draft


@router.put("/drafts/{draft_id}/edit", response_model=DraftResponse)
def edit_draft(draft_id: int, payload: DraftEdit, db: Session = Depends(get_db)):
    """Edit the AI reply content - sets status to Edited."""
    draft = db.query(EmailDraft).filter(EmailDraft.draft_id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    draft.ai_reply = payload.ai_reply
    draft.status = "Edited"
    db.commit()
    db.refresh(draft)
    return draft
