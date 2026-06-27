# KrishiMitra Backend

FastAPI REST API for the KrishiMitra crop disease detection platform.

## Prerequisites

- Python 3.10+
- pip

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

Edit `.env` if you need to change the port or CORS origins.

### 4. Run the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at **http://localhost:8000**.

Interactive docs: **http://localhost:8000/docs**

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
| 400 | Invalid request / validation error |
| 404 | Resource not found |
| 500 | Internal server error |

## Project Structure

```
backend/
├── app/
│   ├── main.py       # FastAPI app & CORS
│   ├── routes.py     # API route handlers
│   ├── models.py     # Pydantic models
│   ├── database.py   # In-memory data store
│   └── utils.py      # Error helpers
├── requirements.txt
├── .env.example
└── README.md
```

## Notes

- Uses an **in-memory Python list** for storage (data resets on server restart).
- Pre-seeded with 8 sample crop diseases on startup.
- CORS is enabled for `http://localhost:3000` (Next.js frontend).
