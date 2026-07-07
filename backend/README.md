# KrishiMitra Backend

FastAPI REST API for the KrishiMitra crop disease detection platform.

## Stack

- **Database:** PostgreSQL (Supabase)
- **ORM:** SQLAlchemy
- **AI:** OpenRouter Vision API (free models)

## Prerequisites

- Python 3.10+
- pip
- A Supabase project with PostgreSQL enabled
- An OpenRouter API key ([OpenRouter](https://openrouter.ai/keys))

## Setup

### 1. Create a virtual environment

```bash
cd backend
python -m venv venv
```

**Windows (PowerShell):**

```powershell
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your Supabase PostgreSQL connection string:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxx.supabase.co:5432/postgres
```

You can find this in the Supabase dashboard under **Project Settings → Database → Connection string → URI**.

Set `OPENROUTER_API_KEY` for AI image disease detection:

```
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
```

**How to obtain an OpenRouter API key:**

1. Go to [OpenRouter Keys](https://openrouter.ai/keys)
2. Sign in or create an account
3. Click **Create Key**
4. Copy the key and paste it into your `.env` file as `OPENROUTER_API_KEY`

The default model is `openrouter/free`, which automatically selects a free vision-capable model. You can override it with `OPENROUTER_MODEL` if needed.

Also adjust `ALLOWED_ORIGINS` if your frontend runs on a different URL.

### 4. Run the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at **http://localhost:8000**.

Interactive docs: **http://localhost:8000/docs**

On startup, the backend automatically creates the `diseases` table and seeds 8 sample records when the database is empty.

## API Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/health` | Health check | 200 |
| GET | `/api/diseases` | List all diseases | 200 |
| GET | `/api/diseases/{id}` | Get one disease | 200 / 404 |
| POST | `/api/diseases` | Create disease | 201 |
| PUT | `/api/diseases/{id}` | Update disease | 200 / 404 |
| DELETE | `/api/diseases/{id}` | Delete disease | 204 / 404 |
| GET | `/api/search?crop=Tomato` | Search by crop | 200 |
| GET | `/api/stats` | Dashboard statistics | 200 |
| POST | `/api/predict` | AI image disease detection | 200 / 4xx / 5xx |

### POST `/api/predict`

Upload a crop image for AI disease detection via OpenRouter Vision.

**Request:** `multipart/form-data` with field `image` (PNG/JPG).

**Success response:**

```json
{
  "success": true,
  "prediction": {
    "crop": "Tomato",
    "disease": "Early Blight",
    "confidence": 95
  },
  "details": {
    "symptoms": "...",
    "treatment": "...",
    "severity": "High",
    "image": "https://..."
  }
}
```

`details` is included only when the predicted disease matches a record in PostgreSQL.

**Test with curl:**

```bash
curl -X POST http://localhost:8000/api/predict \
  -F "image=@/path/to/crop-leaf.jpg"
```

## Error Responses

All errors return JSON:

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status | When |
|--------|------|
| 400 | Invalid request / validation error / invalid image / no image |
| 404 | Resource not found |
| 502 | OpenRouter API error / unavailable |
| 503 | AI service not configured (missing OPENROUTER_API_KEY) |
| 504 | OpenRouter timeout |
| 500 | Internal server error / database lookup failure |

## Project Structure

```
backend/
├── app/
│   ├── main.py       # FastAPI app & CORS
│   ├── routes.py     # API route handlers
│   ├── models.py     # Pydantic models
│   ├── database.py   # SQLAlchemy engine, models & CRUD
│   ├── ai_service.py # OpenRouter Vision disease prediction
│   └── utils.py      # Error helpers
├── requirements.txt
├── .env.example
└── README.md
```

## Notes

- Data is persisted in **PostgreSQL on Supabase** — records survive server restarts.
- Pre-seeded with 8 sample crop diseases on first startup only.
- CORS is enabled for `http://localhost:3000` (Next.js frontend).
- AI detection uses **OpenRouter** with the free `openrouter/free` model router by default.
