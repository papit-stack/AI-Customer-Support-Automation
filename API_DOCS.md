# API Documentation

Base URL: `http://localhost:8000`

Interactive docs available at: `http://localhost:8000/docs`

---

## Endpoints

### GET /api/stats
Returns dashboard statistics.

**Response:**
```json
{
  "total_drafts": 20,
  "pending_reviews": 6,
  "approved_emails": 5,
  "sent_emails": 6,
  "rejected_emails": 2,
  "edited_emails": 1
}
```

---

### GET /api/drafts
Returns all email drafts with optional filtering.

**Query Parameters:**
| Param  | Type   | Description              |
|--------|--------|--------------------------|
| status | string | Filter by status         |
| intent | string | Filter by intent         |
| search | string | Search name/email/subject|

**Example:** `GET /api/drafts?status=Pending&intent=refund_request`

**Response:** Array of draft objects.

---

### GET /api/drafts/{id}
Returns a single draft by ID.

**Response:**
```json
{
  "draft_id": 1,
  "thread_id": "thread-1000",
  "customer_email": "alice@email.com",
  "customer_name": "Alice Johnson",
  "subject": "Where is my order?",
  "customer_message": "...",
  "ai_reply": "...",
  "intent": "order_status",
  "status": "Pending",
  "created_at": "2026-01-20T10:00:00",
  "approved_at": null
}
```

---

### PUT /api/drafts/{id}/approve
Approves a draft. Sets `status=Approved` and `approved_at` to current timestamp.

---

### PUT /api/drafts/{id}/reject
Rejects a draft. Sets `status=Rejected`.

---

### PUT /api/drafts/{id}/edit
Edits the AI reply content. Sets `status=Edited`.

**Request Body:**
```json
{
  "ai_reply": "Modified reply text..."
}
```

---

## n8n Integration (Future)

When ready to connect n8n for automated email sending:

```sql
-- n8n watches for approved drafts
SELECT * FROM email_drafts WHERE status = 'Approved';

-- After sending via Gmail node, update status
UPDATE email_drafts SET status = 'Sent' WHERE draft_id = ?;
```

The n8n workflow should:
1. Poll `email_drafts` for `status = 'Approved'`
2. Send email via Gmail/SMTP node
3. Update `status = 'Sent'` on success
