# VedaAI — AI-Powered Assignment Creator

A full-stack web application that lets teachers create assignments, generate AI-powered question papers, and distribute them as downloadable PDFs — all from a single interface.

**Live Demo:** https://veda-ai.devxforge.tech/  
**Role:** Full Stack Engineer Assignment

---

## Table of Contents

- [What This App Does](#what-this-app-does)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works — Architecture](#how-it-works--architecture)
- [API Reference](#api-reference)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Running Workers](#running-workers)
- [Deployment](#deployment)
- [Features Built](#features-built)
- [Future Scope](#future-scope)

---

## What This App Does

A teacher opens the app, fills in an assignment form — subject, grade level, question types, marks, difficulty level, and optional instructions or a reference PDF. The system then:

1. Queues the request as a background job
2. An AI worker picks it up, builds a structured prompt, and calls the LLM
3. The generated questions are validated, formatted, and rendered into a PDF
4. The PDF is uploaded to S3 storage
5. The teacher gets an email notification with a direct download link
6. The result page shows the full question paper with an answer key

Everything from job queuing to email delivery happens asynchronously — the UI polls for status updates automatically without requiring a page refresh.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 + TypeScript | App framework with file-based routing |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Pre-built accessible UI components |
| Zustand | Lightweight auth state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express (TypeScript) | REST API server |
| MongoDB + Mongoose | Primary database for all data models |
| BullMQ | Job queue for background processing |
| Redis (Upstash) | Queue broker and job state storage |
| Nodemailer | OTP verification and notification emails |
| AWS S3 | Cloud storage for generated and uploaded PDFs |
| Puppeteer | Headless Chrome for HTML-to-PDF rendering |
| OpenAI SDK | LLM API client (pointed at Mistral endpoint) |

---

## Project Structure

```
vedaai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── assignment.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── subject.controller.ts
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts   # JWT cookie verification
│   │   ├── models/
│   │   │   ├── assignment.model.ts
│   │   │   ├── result.model.ts
│   │   │   ├── user.model.ts
│   │   │   ├── subject.model.ts
│   │   │   └── pendingSignup.model.ts
│   │   ├── queues/
│   │   │   └── assignment.queue.ts  # BullMQ queue definitions
│   │   ├── routes/
│   │   │   ├── assignment.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── subject.routes.ts
│   │   ├── seed/
│   │   │   └── seed-subjects.ts     # Seed default subjects
│   │   ├── utils/
│   │   │   ├── compress.ts          # PDF text semantic compression
│   │   │   ├── emailFn.ts           # Email HTML templates
│   │   │   ├── json.ts              # Safe JSON extraction from LLM output
│   │   │   ├── pdf.ts               # Puppeteer PDF generation
│   │   │   ├── pdfTemplate.ts       # HTML exam paper template
│   │   │   ├── prompt.ts            # LLM system + user prompt builders
│   │   │   └── s3.ts                # S3 upload helper
│   │   ├── validation/
│   │   │   ├── resultSchema.ts      # Zod schema for AI output
│   │   │   └── validateSchema.ts    # Request body validators
│   │   ├── workers/
│   │   │   ├── assignment.worker.ts # AI generation + PDF pipeline
│   │   │   └── email.worker.ts      # Email delivery processor
│   │   └── index.ts                 # Express app entry point
│   ├── .env                         # Your credentials (not committed)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── (app)/
    │   │   ├── assignments/
    │   │   │   ├── page.tsx              # Assignment list with filters
    │   │   │   ├── create/page.tsx       # Multi-step creation form
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx          # Assignment detail + live status polling
    │   │   │       └── result/page.tsx   # Generated question paper view
    │   │   ├── groups/page.tsx           # Coming soon
    │   │   ├── library/page.tsx          # Coming soon
    │   │   ├── settings/page.tsx         # Coming soon
    │   │   ├── toolkit/page.tsx          # Coming soon
    │   │   └── layout.tsx               # Sidebar + auth guard
    │   ├── api/                         # Next.js route handlers (proxy to backend)
    │   ├── signin/
    │   ├── signup/
    │   └── verify-email/
    ├── components/
    │   ├── ui/                          # shadcn components
    │   └── veda/                        # App-specific components (sidebar, topbar)
    ├── lib/
    │   └── auth-store.ts                # Zustand auth state
    └── .env.local                       # Frontend env (not committed)
```

---

## How It Works — Architecture

```
┌─────────────────┐         REST /api          ┌──────────────────────┐
│  Next.js 16     │ ──────────────────────────► │  Express API         │
│  (Frontend)     │ ◄────────────────────────── │  :8080               │
└─────────────────┘                             └──────────┬───────────┘
                                                           │
                                          ┌────────────────┼────────────────┐
                                          │                │                │
                                          ▼                ▼                ▼
                                     MongoDB          BullMQ            Redis
                                     Atlas            Queues           (Upstash)
                                          │
                              ┌───────────┴────────────┐
                              │                        │
                              ▼                        ▼
                    Assignment Worker           Email Worker
                    ┌──────────────────┐       ┌──────────────────┐
                    │ 1. Fetch job     │       │ 1. Fetch job     │
                    │ 2. Call Mistral  │       │ 2. Build HTML    │
                    │ 3. Validate JSON │       │ 3. Send via      │
                    │ 4. Build PDF     │       │    Nodemailer    │
                    │ 5. Upload to S3  │       └──────────────────┘
                    │ 6. Queue email   │
                    └──────────────────┘
```

### Assignment Generation Flow (step by step)

1. Teacher submits form → `POST /api/assignments` (multipart, optional PDF)
2. Backend saves assignment with `status: pending`, extracts PDF text if uploaded
3. Job pushed to BullMQ `assignment` queue
4. `assignment.worker.ts` picks it up:
   - If PDF text present → semantically compresses it via LLM call first
   - Builds structured prompt using subject, grade, question breakdown, difficulty
   - Calls Mistral API (OpenAI-compatible) → gets JSON response
   - Extracts and validates JSON strictly against Zod schema
   - Validates question counts and marks match what was requested
   - Renders HTML exam template → Puppeteer generates PDF buffer
   - Uploads PDF to S3 → stores URL in MongoDB Result document
   - Updates assignment `status: completed`
   - Pushes email job to `email` queue
5. `email.worker.ts` sends completion email with PDF link
6. Frontend polls `/api/assignments/:id` every 5 seconds while status is `pending` or `processing` — UI updates automatically when job completes

### Authentication Flow

- Signup → OTP sent to email → verify OTP → account created → JWT cookie set
- All protected routes check JWT via `auth.middleware.ts`
- Frontend stores user state in Zustand, guards routes via Next.js middleware

---

## API Reference

Base: `http://localhost:8080/api`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Creates pending account, sends OTP email |
| POST | `/auth/verify-email` | Verifies OTP, activates account, sets JWT cookie |
| POST | `/auth/resend-verification` | Resends OTP to same email |
| POST | `/auth/signin` | Signs in, sets HttpOnly JWT cookie |
| GET | `/auth/me` | Returns current authenticated user |
| POST | `/auth/logout` | Clears auth cookie |

### Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subjects` | List all subjects (auth required) |
| POST | `/subjects` | Create a new subject — body: `{ name, questionTypes: string[] }` |

### Assignments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/assignments` | Create assignment (multipart: `payload` JSON + optional `pdfFile`) |
| GET | `/assignments` | List with filters: `status`, `subjectId`, `gradeLevel`, `search`, `from`, `to`, `page`, `limit` |
| GET | `/assignments/:id` | Single assignment details |
| GET | `/assignments/:id/result` | Generated result document |
| GET | `/assignments/:id/result/pdf` | Redirect to S3 PDF URL |
| DELETE | `/assignments/:id` | Delete assignment |

**Assignment creation payload schema:**
```json
{
  "title": "string",
  "subjectId": "string",
  "gradeLevel": "string",
  "dueDate": "ISO date string",
  "difficulty": "easy | medium | hard | mixed",
  "questionBreakdown": [
    { "type": "mcq", "count": 5, "marksPerQuestion": 2 }
  ],
  "additionalInstructions": "optional string"
}
```

---

## Local Development Setup

### Prerequisites

- Node.js 20+ (`node -v` to verify)
- MongoDB Atlas account (free M0 tier)
- Upstash Redis account (free tier)
- AWS S3 bucket
- Gmail account with App Password enabled

### Backend

```bash
cd backend
npm install
npx puppeteer browsers install chrome
```

Create `backend/.env` (see Environment Variables section below), then:

```bash
npm run build
npm run seed       # seeds default subjects into MongoDB
npm run start      # starts API on :8080
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```
BACKEND_URL=http://localhost:8080/api
```

```bash
npm run dev        # starts on :3000 (or :3001 if 3000 is busy)
```

---

## Environment Variables

All variables go in `backend/.env`:

```env
# Server
PORT=8080
FRONTEND_ORIGIN=http://localhost:3001

# Database
DB_URL=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/veda-ai-assignment?retryWrites=true&w=majority

# Queue
REDIS_URL=rediss://default:PASSWORD@HOST:PORT

# Auth
JWT_SECRET=your_jwt_secret_here

# AI — Mistral API (OpenAI-compatible)
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_BASE_URL=https://api.mistral.ai/v1
MISTRAL_MODEL=mistral-large-latest

# Storage
AWS_ACCESS_KEY_ID=your_iam_access_key
AWS_SECRET_ACCESS_KEY=your_iam_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
AWS_S3_PUBLIC_BASE_URL=https://your-bucket-name.s3.ap-south-1.amazonaws.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM=youremail@gmail.com
```

> **Note on Mistral:** The backend uses the `openai` npm package pointed at Mistral's OpenAI-compatible API endpoint. No additional SDK needed — only change from the original Gemini setup is the `baseURL` and `MISTRAL_API_KEY` env var.

---

## Running Workers

Workers are separate Node processes that must run alongside the API. Open two additional terminals:

```bash
# Terminal 3 — processes AI generation jobs
cd backend
node dist/workers/assignment.worker.js

# Terminal 4 — processes email delivery jobs
cd backend
node dist/workers/email.worker.js
```

Without workers running, assignments will stay in `pending` state indefinitely. The frontend polls every 5 seconds and will update the UI automatically once workers process the job.

For production scaling with PM2:
```bash
pm2 start dist/workers/assignment.worker.js --name assignment-worker -i 2
pm2 start dist/workers/email.worker.js --name email-worker -i 1
pm2 restart all    # after any .env change
```

---

## Deployment

Deployed on **Render** with the following service layout:

| Service | Type | Root Dir | Start Command |
|---------|------|----------|---------------|
| `vedaai-backend` | Web Service | `backend` | `node dist/index.js` |
| `vedaai-assignment-worker` | Background Worker | `backend` | `node dist/workers/assignment.worker.js` |
| `vedaai-email-worker` | Background Worker | `backend` | `node dist/workers/email.worker.js` |
| `vedaai-frontend` | Web Service | `frontend` | `npm run start` |

Build command for all backend services: `npm install && npm run build`

All env variables from the table above are set per-service in Render's dashboard. `FRONTEND_ORIGIN` in the backend must match the exact Render URL of the frontend service.

External services used in production:
- **MongoDB Atlas** (M0 free tier, ap-south-1) — set network access to `0.0.0.0/0`
- **Upstash Redis** (free tier) — provides the `rediss://` connection string
- **AWS S3** — public bucket for PDF storage with read policy
- **Mistral API** — LLM for question generation

---

## Features Built

### Core Flow
- Assignment creation form with subject selection, grade level, question type breakdown (type + count + marks per question), difficulty selector, due date, and optional additional instructions
- Optional PDF upload — text is extracted, cleaned, and semantically compressed before being injected into the LLM prompt
- Background job processing via BullMQ so the API returns immediately without blocking
- AI-generated structured question paper with sections, difficulty tags per question, marks, options for MCQs, and answers
- Strict Zod validation on LLM output to ensure question counts and total marks match the request exactly
- PDF generation via Puppeteer rendering a styled HTML exam template
- S3 upload with public URL returned for download

### Authentication
- Email-based OTP verification before account activation
- JWT stored in HttpOnly cookie — no localStorage exposure
- Route protection at both middleware and controller level

### UI
- Assignment list with filter by status and search
- Assignment detail page with live status polling (auto-refreshes every 5s while pending or processing, no manual refresh needed)
- Animated status indicator — orange pulse while generating, red on failure
- Result page with full question paper view and PDF download
- Coming Soon placeholder pages for Groups, Toolkit, Library, Settings

### Notifications
- OTP email on signup
- Completion email with PDF link when assignment finishes
- Failure email with error summary if job fails

---

## Future Scope

- WebSocket-based real-time job progress (replace polling)
- Rate limiting on OTP resend to prevent abuse
- Signed S3 URLs for private bucket support
- Retry button on failed assignments
- Dashboard with assignment statistics (total, pending, completed, failed)
- Dark mode toggle (next-themes already installed)
- Admin dashboard for multi-org account management
- Export assignment list to CSV
