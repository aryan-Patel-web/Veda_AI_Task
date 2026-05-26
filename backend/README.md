# VedaAI Backend

AI-powered assessment creator. Teachers define a question paper spec → AI generates a structured, formatted question paper.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                    │
│                                                              │
│  1. Submit form ──────────────────────────────────────────►  │
│  2. Open WebSocket ◄──────── ws://localhost:5001             │
│  3. Poll /status (fallback if WS fails)                      │
│  4. Navigate to result page when status = "done"             │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP POST /api/assignments
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXPRESS API SERVER :5000                  │
│                                                              │
│  POST /api/assignments                                        │
│    ├─ Validate with Zod                                      │
│    ├─ Save Assignment to MongoDB (status: pending)           │
│    ├─ Add job to BullMQ queue                                │
│    └─ Return { assignmentId } immediately                    │
│                                                              │
│  GET /api/assignments/:id                                     │
│    ├─ Check Redis cache                                      │
│    ├─ Fetch Assignment + Result from MongoDB                 │
│    └─ Cache completed results for 1 hour                     │
└───────────────────────────────────────────┬─────────────────┘
                                            │
                                            │ BullMQ job
                                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BULLMQ WORKER (separate process)          │
│                                                              │
│  1. Pick up job from queue                                   │
│  2. Update status → "processing"                            │
│  3. Build structured prompt from job data                    │
│  4. Call LLM API (GPT-4o / Claude)                          │
│  5. Parse JSON response → validate schema                   │
│  6. Save Result to MongoDB                                   │
│  7. Update Assignment status → "done"                       │
│  8. BullMQ emits "completed" event                          │
└───────────────────────────────────────────┬─────────────────┘
                                            │ QueueEvents
                                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   WEBSOCKET SERVER :5001                     │
│                                                              │
│  Listens to BullMQ QueueEvents                              │
│  Routes status updates to subscribed frontend clients       │
│  Map<assignmentId, Set<WebSocket>>                          │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| HTTP API | Node.js + Express + TypeScript |
| Database | MongoDB (Mongoose) |
| Cache | Redis (ioredis) |
| Job Queue | BullMQ |
| WebSocket | ws |
| Validation | Zod |
| AI | OpenAI GPT-4o (or Claude) |

## Setup

### Prerequisites
- Node.js 18+
- Docker (for MongoDB + Redis)
- OpenAI API key

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 3. Start MongoDB + Redis
```bash
docker-compose up -d
```

### 4. Start API server
```bash
npm run dev
```

### 5. Start worker (separate terminal)
```bash
npm run dev:worker
```

The API runs on `http://localhost:5000`  
WebSocket runs on `ws://localhost:5001`

## API Endpoints

### Create Assignment
```
POST /api/assignments
Content-Type: multipart/form-data

Body:
{
  subject: "Science",
  grade: "Class 8",
  schoolName: "Delhi Public School",
  dueDate: "2025-06-21",
  questionTypes: [
    { type: "Multiple Choice Questions", count: 4, marksPerQuestion: 1 },
    { type: "Short Questions", count: 3, marksPerQuestion: 2 }
  ],
  additionalInstructions: "Focus on Chapter 12 - Electricity",
  file: <optional PDF/TXT file>
}

Response:
{
  success: true,
  data: { assignmentId: "abc123", status: "pending" }
}
```

### Get Assignment + Result
```
GET /api/assignments/:id

Response:
{
  success: true,
  data: {
    assignment: { id, subject, grade, status, dueDate, ... },
    result: {
      paper: {
        sections: [
          {
            title: "Section A",
            instruction: "Attempt all questions.",
            questions: [
              {
                number: 1,
                text: "What is electric current?",
                difficulty: "Easy",
                marks: 1,
                type: "Multiple Choice Questions",
                options: ["A) ...", "B) ...", "C) ...", "D) ..."]
              }
            ]
          }
        ],
        answerKey: [{ questionNumber: 1, answer: "C) ..." }],
        metadata: { totalQuestions: 7, totalMarks: 10, timeAllowed: "30 minutes" }
      }
    }
  }
}
```

### Get Status (polling fallback)
```
GET /api/assignments/:id/status

Response:
{ success: true, data: { status: "done", updatedAt: "..." } }
```

### List All Assignments
```
GET /api/assignments

Response:
{ success: true, data: [...assignments] }
```

### Delete Assignment
```
DELETE /api/assignments/:id

Response:
{ success: true, message: "Assignment deleted successfully" }
```

## WebSocket Protocol

Connect: `ws://localhost:5001`

### Subscribe to assignment updates
```json
{ "type": "subscribe", "assignmentId": "abc123" }
```

### Receive status updates
```json
{ "type": "status_update", "assignmentId": "abc123", "status": "processing", "timestamp": "..." }
{ "type": "status_update", "assignmentId": "abc123", "status": "done", "timestamp": "..." }
{ "type": "status_update", "assignmentId": "abc123", "status": "failed", "error": "...", "timestamp": "..." }
```

### Keep-alive ping
```json
{ "type": "ping" }
// Response: { "type": "pong", "timestamp": "..." }
```

## Data Models

### Assignment
```
id, subject, grade, schoolName, dueDate,
questionTypes: [{ type, count, marksPerQuestion }],
additionalInstructions, fileUrl,
status: "pending" | "processing" | "done" | "failed",
errorMessage, createdAt, updatedAt
```

### Result
```
id, assignmentId,
paper: {
  sections: [{ title, instruction, questions: [{ number, text, difficulty, marks, type, options? }] }],
  answerKey: [{ questionNumber, answer }],
  metadata: { totalQuestions, totalMarks, timeAllowed, subject, grade }
},
generatedAt, promptTokensUsed, completionTokensUsed
```

## Key Design Decisions

**Why separate Worker process?**  
LLM calls take 5–15 seconds. Running them in the Express event loop would block all other requests. The worker runs independently and can be scaled horizontally.

**Why BullMQ instead of raw setTimeout?**  
BullMQ provides job persistence (survives server restart), automatic retries with backoff, concurrency control, and monitoring tools.

**Why not render raw LLM response?**  
Raw LLM text has inconsistent formatting. By demanding strict JSON and validating it against our schema, we guarantee the frontend always gets clean, typed data.

**Why Redis cache on GET /assignments/:id?**  
Once a paper is generated, it never changes. Caching saves MongoDB reads and makes the output page load instantly on repeat visits.
