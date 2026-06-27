# KrishiMitra

AI-Powered Crop Disease Detection & Advisory Platform

## One-Line Pitch

KrishiMitra helps farmers identify crop diseases from images and receive AI-powered treatment recommendations to improve crop health and productivity.

## Features

- Crop Disease Detection
- AI-Based Advisory System
- Disease Library with REST API
- Multi-Crop Support
- Farmer Dashboard with Analytics
- Search Diseases by Crop

## Tech Stack

### Frontend
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React / Framer Motion

### Backend
- FastAPI
- Python
- Uvicorn
- Pydantic
- In-memory database (Week 4)

## Quick Start

### Backend (port 8000)

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

### Frontend (port 3000)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

Copy `frontend/.env.example` to `frontend/.env.local` if you need a custom API URL.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/diseases` | List all diseases |
| GET | `/api/diseases/{id}` | Get one disease |
| POST | `/api/diseases` | Create disease |
| PUT | `/api/diseases/{id}` | Update disease |
| DELETE | `/api/diseases/{id}` | Delete disease |
| GET | `/api/search?crop=Tomato` | Search by crop |
| GET | `/api/stats` | Dashboard statistics |

## Project Structure

```
krishimitra-main/
├── backend/          # FastAPI REST API
│   └── app/
├── frontend/         # Next.js App Router
│   ├── app/          # Pages & routes
│   ├── components/   # UI components
│   ├── services/     # API client (api.ts)
│   └── types/        # TypeScript interfaces
└── docs/
```

## Status

Week 4 — Full Stack Integration Complete
