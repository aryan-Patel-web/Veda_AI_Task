<div align="center">

<img src="https://raw.githubusercontent.com/aryan-Patel-web/Veda_AI_Task/main/frontend/public/veda/logo.png" alt="VedaAI Logo" width="80"/>

# VedaAI — AI-Powered Assignment Creator

**A full-stack platform for teachers to generate AI-powered question papers and distribute them as downloadable PDFs — all from a single interface.**

<br/>

## 🚀 Working Prototype — Try It Live Right Now

<a href="https://vedaai-frontend-yjvl.onrender.com/signup">
  <img src="https://img.shields.io/badge/🌐%20OPEN%20LIVE%20APP-%20vedaai--frontend--yjvl.onrender.com-22c55e?style=for-the-badge" alt="Open Live App"/>
</a>

> **→ [https://vedaai-frontend-yjvl.onrender.com](https://vedaai-frontend-yjvl.onrender.com/signup)**
>
> Sign up with any email · Get a real OTP · Create an assignment · Watch AI generate a question paper · Download the PDF

<br/>

| 🖥️ Frontend | ⚙️ Backend API |
|:---:|:---:|
| [vedaai-frontend-yjvl.onrender.com](https://vedaai-frontend-yjvl.onrender.com) | [vedaai-backend-ygeq.onrender.com](https://vedaai-backend-ygeq.onrender.com) |

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-aryan--Patel--web%2FVeda__AI__Task-181717?style=for-the-badge&logo=github)](https://github.com/aryan-Patel-web/Veda_AI_Task)
[![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge&logo=redis)](https://upstash.com)

</div>

---

## 📸 App Screenshots

<!-- ============================================================
  HOW TO ADD YOUR SCREENSHOTS (one-time setup):
  1. In your GitHub repo, click "Add file" → "Upload files"
  2. Create path:  docs/screenshots/  and upload these 6 files:
       signup.png · otp-verify.png · assignments-empty.png
       create-assignment.png · assignment-processing.png · assignment-completed.png
  3. The images below will auto-render once the files exist.
  TIP: Open this README.md in the GitHub web editor and drag-drop
       images directly — GitHub uploads and pastes the URL for you.
============================================================ -->

<table>
  <tr>
    <td align="center" width="50%">
      <b>① Sign Up</b><br/>
      <img src="docs/screenshots/signup.png" alt="Sign Up Page" width="100%"/>
      <br/><sub>Enter name, email, password → click <b>Send Verification Code</b></sub>
    </td>
    <td align="center" width="50%">
      <b>② Email OTP Verification</b><br/>
      <img src="docs/screenshots/otp-verify.png" alt="OTP Verification" width="100%"/>
      <br/><sub>A real 6-digit OTP is emailed — enter it to activate your account</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <b>③ Assignments Dashboard</b><br/>
      <img src="docs/screenshots/assignments-empty.png" alt="Empty Dashboard" width="100%"/>
      <br/><sub>Clean empty state with a single CTA to create the first assignment</sub>
    </td>
    <td align="center" width="50%">
      <b>④ Create Assignment Form</b><br/>
      <img src="docs/screenshots/create-assignment.png" alt="Create Assignment" width="100%"/>
      <br/><sub>Subject · Grade · Question breakdown · Difficulty · Optional PDF upload</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <b>⑤ AI Processing (Live Polling)</b><br/>
      <img src="docs/screenshots/assignment-processing.png" alt="Processing" width="100%"/>
      <br/><sub>Animated orange pulse badge — auto-refreshes every 5s, no page reload</sub>
    </td>
    <td align="center" width="50%">
      <b>⑥ Assignment Completed</b><br/>
      <img src="docs/screenshots/assignment-completed.png" alt="Completed" width="100%"/>
      <br/><sub>Green badge → click to view full question paper + download PDF</sub>
    </td>
  </tr>
</table>

---

## 🔄 Complete User Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FULL USER JOURNEY                                   │
└─────────────────────────────────────────────────────────────────────────────┘

  [1] SIGNUP                [2] EMAIL VERIFY           [3] DASHBOARD
  ┌─────────────┐           ┌────────────────┐         ┌───────────────────┐
  │ First Name  │           │ 6-digit OTP    │  JWT    │  Assignments List │
  │ Last Name   │──POST────▶│ sent to inbox  │──────── ▶│  (HttpOnly cookie)│
  │ Email       │  /signup  │                │  cookie │                   │
  │ Password    │           │ POST /verify   │         └────────┬──────────┘
  └─────────────┘           └────────────────┘                  │
                                                                 │ Click "Create Assignment"
  [4] CREATE FORM           [5] BACKGROUND WORKER               ▼
  ┌─────────────────┐       ┌──────────────────────┐  ┌──────────────────────┐
  │ Title           │       │ BullMQ picks job     │  │  POST /assignments   │
  │ Subject         │       │ ↓ compress PDF text  │◀─│  (multipart/form)    │
  │ Grade Level     │──────▶│ ↓ build LLM prompt   │  │  status: pending     │
  │ Question Types  │       │ ↓ call Mistral API   │  └──────────────────────┘
  │ Marks per Q     │       │ ↓ validate via Zod   │
  │ Difficulty      │       │ ↓ Puppeteer → PDF    │
  │ Optional PDF    │       │ ↓ upload → S3        │
  └─────────────────┘       │ ↓ status: completed  │
                            │ ↓ queue email job    │
  [6] RESULT PAGE           └──────────────────────┘
  ┌──────────────────────────────────────┐
  │  Section A  │ Section B  │ Section C │   + Answer Key
  │  MCQs       │ Short Ans  │ Long Ans  │   + PDF Download Button
  │  [Easy] [2m]│ [Med] [5m] │ [Hard][10m│   + Completion Email sent
  └──────────────────────────────────────┘
```

---

## ✨ What This App Does

A teacher opens VedaAI, fills in an assignment form — subject, grade level, question types, marks, difficulty, and an optional reference PDF. The system then:

1. **Queues** the request as a background job (API returns immediately)
2. An **AI worker** picks it up, builds a structured prompt, and calls the Mistral LLM
3. The generated questions are **validated strictly** against a Zod schema (counts + marks must match)
4. A styled **PDF is rendered** via Puppeteer and uploaded to AWS S3
5. The teacher gets an **email notification** with a direct download link
6. The **result page** shows the full question paper with an answer key

Everything from job queuing to email delivery happens asynchronously — the UI **polls every 5 seconds** and updates automatically without a page refresh.

---

## 🛠️ Tech Stack

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
| BullMQ | Job queue for background AI + PDF processing |
| Redis (Upstash) | Queue broker and job state storage |
| Nodemailer | OTP verification and completion emails |
| AWS S3 | Cloud storage for generated and uploaded PDFs |
| Puppeteer | Headless Chrome for HTML-to-PDF rendering |
| OpenAI SDK → Mistral | LLM API (OpenAI-compatible endpoint) |

---

## 🏗️ Architecture Overview

```
┌─────────────────┐         REST /api          ┌──────────────────────┐
│  Next.js 16     │ ──────────────────────────▶ │  Express API  :8080  │
│  (Frontend)     │ ◀────────────────────────── │                      │
└─────────────────┘                             └──────────┬───────────┘
                                                           │
                                          ┌────────────────┼────────────────┐
                                          │                │                │
                                          ▼                ▼                ▼
                                     MongoDB          BullMQ            Redis
                                     Atlas            Queues           (Upstash)
                                          │
                              ┌───────────┴─────────────┐
                              │                         │
                              ▼                         ▼
                    Assignment Worker           Email Worker
                    ┌─────────────────┐        ┌──────────────────┐
                    │ 1. Fetch job    │        │ 1. Fetch job     │
                    │ 2. Call Mistral │        │ 2. Build HTML    │
                    │ 3. Validate Zod │        │ 3. Send via      │
                    │ 4. Puppeteer PDF│        │    Nodemailer    │
                    │ 5. Upload to S3 │        └──────────────────┘
                    │ 6. Queue email  │
                    └─────────────────┘
```

### Assignment Generation Flow (step-by-step)

```
Teacher submits form
       │
       ▼
POST /api/assignments   ──▶  Save to MongoDB (status: pending)
                                       │
                                       ▼
                              BullMQ assignment queue
                                       │
                                       ▼
                            assignment.worker.ts picks up
                                       │
                         ┌─────────────┴────────────────┐
                         │                              │
                  PDF uploaded?                   No PDF
                         │                              │
                         ▼                              ▼
                  Semantic compress          Build prompt directly
                  via Mistral LLM
                         │
                         ▼
               Build structured prompt
               (subject, grade, breakdown, difficulty)
                         │
                         ▼
               Call Mistral API (OpenAI-compatible)
                         │
                         ▼
               Extract & validate JSON (Zod schema)
               Validate question counts + marks
                         │
                         ▼
               Render HTML exam template
               Puppeteer → PDF buffer
                         │
                         ▼
               Upload PDF → AWS S3
               Store URL in MongoDB Result document
                         │
                         ▼
               Update assignment → status: completed
                         │
                         ▼
               Push email job → email queue
                         │
                         ▼
               email.worker.ts sends completion email
                         │
                         ▼
               Frontend polls /assignments/:id every 5s
               UI updates automatically ✅
```

### Authentication Flow

```
  Signup Form              Backend                    Email Inbox
  ──────────               ───────                    ───────────
  POST /auth/signup  ───▶  Save PendingSignup   ───▶  6-digit OTP
                           Send OTP via Gmail
                                  │
  Enter OTP          ───▶  POST /auth/verify-email
                           Activate account
                           Set HttpOnly JWT cookie ◀─── protected from XSS
                                  │
  Redirect to /assignments        │
  Zustand stores user state       │
  All routes guarded by middleware
```

---

## 📁 Project Structure

```
vedaai/
├── backend/
│   └── src/
│       ├── config/          # MongoDB connection
│       ├── controllers/     # assignment, auth, subject controllers
│       ├── middlewares/     # JWT cookie verification
│       ├── models/          # Mongoose schemas (Assignment, Result, User, Subject, PendingSignup)
│       ├── queues/          # BullMQ queue definitions
│       ├── routes/          # Express route definitions
│       ├── seed/            # Seed default subjects
│       ├── utils/
│       │   ├── compress.ts      # PDF text semantic compression via LLM
│       │   ├── emailFn.ts       # Email HTML templates
│       │   ├── json.ts          # Safe JSON extraction from LLM output
│       │   ├── pdf.ts           # Puppeteer PDF generation
│       │   ├── pdfTemplate.ts   # Styled HTML exam paper template
│       │   ├── prompt.ts        # LLM system + user prompt builders
│       │   └── s3.ts            # S3 upload helper
│       ├── validation/
│       │   ├── resultSchema.ts  # Zod schema for AI output validation
│       │   └── validateSchema.ts# Request body validators
│       └── workers/
│           ├── assignment.worker.ts  # AI generation + PDF pipeline
│           └── email.worker.ts       # Email delivery processor
│
└── frontend/
    └── app/
        ├── (app)/
        │   ├── assignments/
        │   │   ├── page.tsx          # Assignment list + filters
        │   │   ├── create/page.tsx   # Multi-step creation form
        │   │   └── [id]/
        │   │       ├── page.tsx      # Detail + live status polling
        │   │       └── result/page.tsx # Generated question paper view
        │   └── layout.tsx            # Sidebar + auth guard
        ├── api/                      # Next.js route handlers (proxy to backend)
        ├── signin/ signup/ verify-email/
        └── lib/
            └── auth-store.ts         # Zustand auth state
```

---

## ⚡ Local Development Setup

### Prerequisites
- Node.js 20+ (`node -v` to verify)
- MongoDB Atlas account (free M0 tier)
- Upstash Redis account (free tier)
- AWS S3 bucket with public read policy
- Gmail account with [App Password enabled](https://support.google.com/accounts/answer/185833)

### Backend Setup

```bash
cd backend
npm install
npx puppeteer browsers install chrome
```

Create `backend/.env` (see Environment Variables below), then:

```bash
npm run build
npm run seed       # seeds default subjects into MongoDB
npm run start      # starts API on :8080
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
# For local dev:
BACKEND_URL=http://localhost:8080/api

# For production (already set on Render):
# BACKEND_URL=https://vedaai-backend-ygeq.onrender.com/api
```

```bash
npm run dev        # starts on :3000
```

### Running Workers (Required — open two extra terminals)

```bash
# Terminal 3 — AI generation jobs
cd backend
node dist/workers/assignment.worker.js

# Terminal 4 — Email delivery jobs
cd backend
node dist/workers/email.worker.js
```

> Without workers running, assignments will stay `pending` indefinitely.

---

## 🔑 Environment Variables


All variables go in `backend/.env`:

```env
# ── Server ────────────────────────────────────────────────────
PORT=8080
FRONTEND_ORIGIN=https://vedaai-frontend-yjvl.onrender.com
PUPPETEER_CACHE_DIR=/opt/render/project/.puppeteer_cache   # Render only

# ── Database (MongoDB Atlas) ───────────────────────────────────
DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<AppName>

# ── Queue (Upstash Redis) ──────────────────────────────────────
REDIS_URL=rediss://default:<password>@<host>.upstash.io:6379

# ── Auth ──────────────────────────────────────────────────────
JWT_SECRET=<your-long-random-secret>

# ── AI — Mistral (OpenAI-compatible endpoint) ─────────────────
MISTRAL_API_KEY=<your-mistral-api-key>
MISTRAL_BASE_URL=https://api.mistral.ai/v1
MISTRAL_MODEL=mistral-large-latest

# ── Storage (AWS S3) ──────────────────────────────────────────
AWS_ACCESS_KEY_ID=<your-iam-access-key>
AWS_SECRET_ACCESS_KEY=<your-iam-secret-key>
AWS_REGION=us-east-1
AWS_S3_BUCKET=vedaai-pdfs-aryan
AWS_S3_PUBLIC_BASE_URL=https://vedaai-pdfs-aryan.s3.amazonaws.com

# ── Email (Brevo SMTP relay) ──────────────────────────────────
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=<your-brevo-smtp-login>
SMTP_PASS=<your-brevo-smtp-key>
SMTP_FROM="veda ai <youremail@gmail.com>"
```

<details>
<summary><b>📋 Where to get each value</b></summary>

| Variable | Where to get it |
|---|---|
| `DB_URL` | MongoDB Atlas → Connect → Drivers → copy connection string |
| `REDIS_URL` | Upstash console → your database → `rediss://` connection string |
| `JWT_SECRET` | Any long random string — run `openssl rand -hex 32` |
| `MISTRAL_API_KEY` | [console.mistral.ai](https://console.mistral.ai) → API Keys |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | AWS IAM → create user with S3 full access |
| `AWS_S3_BUCKET` | Your S3 bucket name (this project: `vedaai-pdfs-aryan`) |
| `AWS_REGION` | Your bucket's region (this project: `us-east-1`) |
| `SMTP_HOST/USER/PASS` | Brevo → SMTP & API → SMTP tab → copy credentials |
| `SMTP_FROM` | Sender display name + email shown to recipients |
| `PUPPETEER_CACHE_DIR` | Render-specific path for Chromium cache — only needed on Render |

</details>

---

## 📡 API Reference

**Production Base URL:** `https://vedaai-backend-ygeq.onrender.com/api`

**Local Dev Base URL:** `http://localhost:8080/api`

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Creates pending account, sends OTP email |
| POST | `/auth/verify-email` | Verifies OTP, activates account, sets JWT cookie |
| POST | `/auth/resend-verification` | Resends OTP |
| POST | `/auth/signin` | Signs in, sets HttpOnly JWT cookie |
| GET | `/auth/me` | Returns current authenticated user |
| POST | `/auth/logout` | Clears auth cookie |

### Subjects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/subjects` | List all subjects (auth required) |
| POST | `/subjects` | Create new subject — `{ name, questionTypes: string[] }` |

### Assignments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/assignments` | Create assignment (multipart: payload JSON + optional pdfFile) |
| GET | `/assignments` | List with filters: `status`, `subjectId`, `gradeLevel`, `search`, `from`, `to`, `page`, `limit` |
| GET | `/assignments/:id` | Single assignment details |
| GET | `/assignments/:id/result` | Generated result document |
| GET | `/assignments/:id/result/pdf` | Redirect to S3 PDF URL |
| DELETE | `/assignments/:id` | Delete assignment |

**Assignment creation payload:**

```json
{
  "title": "End Semester Exam",
  "subjectId": "64abc...",
  "gradeLevel": "Grade 10",
  "dueDate": "2026-05-29T00:00:00.000Z",
  "difficulty": "mixed",
  "questionBreakdown": [
    { "type": "mcq", "count": 10, "marksPerQuestion": 2 },
    { "type": "short", "count": 5, "marksPerQuestion": 4 }
  ],
  "additionalInstructions": "Focus on thermodynamics chapter"
}
```

---

## ✅ Features Built

### Core Assignment Pipeline
- Multi-step creation form with subject selection, grade, question type breakdown (type + count + marks), difficulty selector, due date, and optional additional instructions
- Optional PDF upload — text is extracted, semantically compressed via LLM, and injected into the prompt
- Background job processing via BullMQ — API returns immediately without blocking
- Strict Zod validation on LLM output — question counts and total marks are verified to match the request exactly
- PDF generated by Puppeteer rendering a styled HTML exam template
- S3 upload with public URL returned for download

### Authentication
- Email-based OTP verification before account activation
- JWT stored in HttpOnly cookie — no `localStorage` exposure
- Route protection at both Next.js middleware and Express controller level
- Zustand auth state management on the frontend

### UI / UX
- Assignment list with filter by status and search
- Live status polling — auto-refreshes every 5s while `pending` or `processing`, no manual refresh needed
- Animated status badge — orange pulse while generating, red on failure, green on completion
- Result page with full structured question paper view and PDF download button
- Coming Soon placeholder pages for Groups, Toolkit, Library, Settings

### Notifications
- OTP email on signup
- Completion email with PDF download link when assignment finishes
- Failure email with error summary if worker job fails

---

## 🚀 Deployment

Deployed on **Render** with the following service layout:

| Service | Type | URL |
|---|---|---|
| `vedaai-backend` | Web Service | [vedaai-backend-ygeq.onrender.com](https://vedaai-backend-ygeq.onrender.com) |
| `vedaai-assignment-worker` | Background Worker | *(no public URL — background process)* |
| `vedaai-email-worker` | Background Worker | *(no public URL — background process)* |
| `vedaai-frontend` | Web Service | [vedaai-frontend-yjvl.onrender.com](https://vedaai-frontend-yjvl.onrender.com) |

Build command for all backend services: `npm install && npm run build`

**External services in production:**
- MongoDB Atlas (M0 free tier, `ap-south-1`) — network access set to `0.0.0.0/0`
- Upstash Redis (free tier) — provides the `rediss://` connection string
- AWS S3 — public bucket for PDF storage with read policy
- Mistral API — LLM for question generation

**Production scaling with PM2:**

```bash
pm2 start dist/workers/assignment.worker.js --name assignment-worker -i 2
pm2 start dist/workers/email.worker.js --name email-worker -i 1
pm2 restart all    # after any .env change
```

---

## 🔭 Future Scope

- WebSocket real-time progress (replace polling)
- Rate limiting on OTP resend
- Signed S3 URLs for private bucket support
- Retry button on failed assignments
- Dashboard with assignment statistics (total, pending, completed, failed)
- Dark mode toggle (`next-themes` already installed)
- Admin dashboard for multi-org account management
- Export assignment list to CSV

---

## 📸 How to Add Screenshots to Your README

1. Create a `docs/screenshots/` folder in your repo root
2. Add your screenshots there (e.g., `signup.png`, `create-assignment.png`)
3. Commit and push
4. Reference them in the README with relative paths:

```markdown
![Sign Up](docs/screenshots/signup.png)
```

**Tip for GitHub web editor:** Open your README.md in the GitHub editor, then drag-and-drop an image anywhere into the text — GitHub uploads it automatically and pastes the full `![image](url)` markdown.

**Image naming used in this README:**

```
docs/screenshots/
├── signup.png              
├── otp-verify.png          
├── assignments-empty.png    
├── create-assignment.png   
├── assignment-processing.png 
└── assignment-completed.png  
```

---

## 👤 Author

**Aryan Patel**
B.Tech CSE, IIIT Manipur | Roll No: 230101047
[GitHub](https://github.com/aryan-Patel-web/Veda_AI_Task) · [Live App](https://vedaai-frontend-yjvl.onrender.com) · [Backend API](https://vedaai-backend-ygeq.onrender.com)

---

<div align="center">

Built for **VedaAI Full Stack Engineer Assignment** — Round 2 Technical Round

**🌐 Try the live prototype → [vedaai-frontend-yjvl.onrender.com](https://vedaai-frontend-yjvl.onrender.com/signup)**

</div>
