# Customer Support Dashboard

Human-in-the-Loop AI Email Draft Review System. An internal dashboard for support agents to review, edit, approve, and reject AI-generated email drafts before they are sent to customers.

## Tech Stack

- **Frontend:** React 18 + Tailwind CSS + Vite
- **Backend:** FastAPI + SQLAlchemy
- **Database:** PostgreSQL
- **Communication:** REST API

## Project Structure

```
AI_Automation/
├── backend/
│   ├── app/
│   │   ├── config.py          # Environment configuration
│   │   ├── database.py        # Database connection
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── routes.py          # API endpoints
│   │   └── main.py            # FastAPI application
│   ├── seed.py                # Database seeder (20 sample drafts)
│   ├── setup.sql              # Manual DB setup script
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx     # Sidebar layout
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  # Stats overview
│   │   │   ├── DraftInbox.jsx # Draft list with filters
│   │   │   └── DraftReview.jsx# Single draft review
│   │   ├── utils/
│   │   │   ├── api.js         # API client
│   │   │   └── helpers.js     # Formatting utilities
│   │   ├── App.jsx            # Router setup
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind imports
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── API_DOCS.md                # API documentation
└── README.md                  # This file
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 14+

## Setup Instructions

### 1. Database

```sql
-- Create the database
CREATE DATABASE customer_support;
```

Or run the setup script:
```bash
psql -U postgres -f backend/setup.sql
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Seed database with sample data
python seed.py

# Start the server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Dashboard available at: http://localhost:5173

## Features

### Dashboard Home
- Summary cards: Total Drafts, Pending, Approved, Sent, Rejected
- Recent pending drafts table with quick review links

### Draft Inbox
- Full table of all email drafts
- Filter by status and intent
- Search by customer name, email, or subject
- Click to review any draft

### Draft Review
- View customer info, original message, and AI reply
- Edit the AI reply in an editable text area
- Approve, Reject, or Save Edit actions
- Visual feedback with toast notifications

## Status Values

| Status    | Description                              |
|-----------|------------------------------------------|
| Pending   | Awaiting agent review                    |
| Approved  | Agent approved for sending               |
| Rejected  | Agent rejected the draft                 |
| Edited    | Agent modified the AI reply              |
| Sent      | Email sent to customer (via n8n future)  |

## n8n Integration (Future)

The backend is designed for easy n8n integration:

1. n8n polls `GET /api/drafts?status=Approved`
2. n8n sends email via Gmail/SMTP
3. n8n calls `PUT /api/drafts/{id}/edit` or a dedicated endpoint to set `status=Sent`

See [API_DOCS.md](API_DOCS.md) for integration details.

## Security Notes

- No authentication in this MVP (internal tool)
- Structured for easy auth addition later (JWT, session-based)
- CORS configured for local development
- No secrets in code - use .env files
