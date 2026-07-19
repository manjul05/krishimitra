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

Week 7 — Groq AI Crop Advisory Integration Complete

## AI Advisory Feature (Week 7)

We have integrated a **Groq-powered AI Crop Advisory System** using the **llama-3.3-70b-versatile** model (with fallback to **llama3-70b-8192**). The advisor helps farmers with professional treatment and prevention strategies after a disease is predicted.

### Groq & OpenRouter Setup & Environment Variables

To activate the AI advisor and prediction pipelines, configure the following variables in your `backend/.env` file:

```env
# Groq API Key (Obtain from https://console.groq.com)
GROQ_API_KEY=gsk_your_actual_groq_api_key

# OpenRouter Vision API (Obtain from https://openrouter.ai)
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
```

Make sure the `.env` file is in your `.gitignore` to prevent committing secrets.

### Installation

Ensure the required backend libraries are installed:
```bash
cd backend
pip install groq python-dotenv
```

### API Endpoint

#### POST `/api/ai/advisor`

Request agricultural advice for a crop disease.

- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "crop": "Tomato",
  "disease": "Late Blight",
  "language": "english"
}
```
*Supported languages: `english`, `hindi`.*

- **Example Success Response (Status 200)**:
```json
{
  "success": true,
  "data": {
    "disease": "Late Blight",
    "severity": "High",
    "cause": "Late blight is caused by the fungus-like organism Phytophthora infestans...",
    "organic_treatment": "Apply copper-based organic fungicides, prune lower leaves, spray Neem oil...",
    "chemical_treatment": "Spray systemic fungicides containing Metalaxyl + Mancozeb...",
    "prevention": "Ensure wide plant spacing, use drip irrigation to avoid wet leaves...",
    "farmer_tips": "Avoid high nitrogen fertilizers as they encourage succulent, vulnerable growth..."
  }
}
```

- **Example Error Response (Status 400/429/502/504/500)**:
```json
{
  "success": false,
  "message": "Unable to generate AI response."
}
```

### How to Run

1. **Start Backend FastAPI Server**:
   ```bash
   cd backend
   .\venv\Scripts\activate  # Windows
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend Next.js Client**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` in your browser. Navigating to the **AI Advisor** tab or running a disease detection scan will allow you to generate smart recommendations.

