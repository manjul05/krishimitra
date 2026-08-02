# KrishiMitra – AI Powered Crop Disease Detection & Advisory Platform

KrishiMitra is a modern, AI-powered agricultural web application designed to help farmers detect crop diseases from leaf images and receive immediate, actionable advisory recommendations in English and Hindi.

---

## Live Deployments

- **Frontend Application (Vercel)**: `https://YOUR-VERCEL-APP.vercel.app`
- **Backend REST API (Render)**: `https://YOUR-RENDER-BACKEND.onrender.com`
- **Database Service (Supabase)**: `Supabase Managed PostgreSQL`

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React, Custom Responsive Components

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **ORM & DB Engine**: SQLAlchemy 2.0+ & Psycopg2
- **Validation**: Pydantic v2
- **Security & Auth**: JWT (`python-jose`), Passlib (`bcrypt`), SlowAPI (Rate Limiting)
- **ASGI Server**: Uvicorn & Gunicorn

### Database & Storage
- **Database**: Supabase PostgreSQL

### AI & Vision APIs
- **Vision Model**: OpenRouter Vision API
- **Agricultural Advisory Model**: Groq Llama 3.3 70B Versatile

---

## Environment Variables Configuration

### Frontend Environment Variables (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Public production backend URL | `https://krishimitra-backend.onrender.com` |

### Backend Environment Variables (`backend/.env`)

| Variable | Description | Required | Default / Example |
|----------|-------------|----------|-------------------|
| `HOST` | Server bind host | No | `0.0.0.0` |
| `PORT` | Server port | No | `8000` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | Yes | `https://krishimitra.vercel.app,http://localhost:3000` |
| `FRONTEND_URL` | Frontend domain for OAuth redirects | Yes | `https://krishimitra.vercel.app` |
| `DATABASE_URL` | Supabase PostgreSQL connection string | Yes | `postgresql://postgres:pass@db.supabase.co:5432/postgres` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Yes | `your_long_random_jwt_secret_key` |
| `OPENROUTER_API_KEY` | OpenRouter Vision API Key | Yes | `sk-or-v1-...` |
| `OPENROUTER_MODEL` | Vision AI model | No | `openrouter/free` |
| `OPENROUTER_TIMEOUT_SECONDS` | Timeout duration in seconds | No | `60` |
| `GROQ_API_KEY` | Groq AI Advisory API Key | Yes | `gsk_...` |
| `GROQ_MODEL` | Advisory LLM model | No | `llama-3.3-70b-versatile` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Optional | `xxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Optional | `GOCSPX-xxxx` |
| `GOOGLE_REDIRECT_URI` | Google OAuth Callback URL | Optional | `https://krishimitra-backend.onrender.com/api/auth/google/callback` |

---

## Deployment Instructions

### 1. Database Setup (Supabase)
1. Log in to [Supabase](https://supabase.com) and create a new PostgreSQL database project.
2. Retrieve your `DATABASE_URL` connection string from Project Settings > Database.
3. Tables and initial seed data will automatically initialize on backend startup.

### 2. Backend Deployment (Render)
1. Log in to [Render](https://render.com) and create a new **Web Service**.
2. Connect your Git repository.
3. Configure service settings:
   - **Name**: `krishimitra-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add all required backend environment variables under **Environment** settings.
5. Deploy service and copy your Render URL (e.g. `https://krishimitra-backend.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Log in to [Vercel](https://vercel.com) and import your Git repository.
2. Configure project settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://YOUR-RENDER-BACKEND.onrender.com`
4. Deploy application.

---

## Known Limitations

- **Free-Tier Cold Starts**: Render web services on free tiers spin down after inactivity, causing initial API requests to take 30–50 seconds on cold start.
- **OpenRouter Free Tier Limits**: Free vision AI models on OpenRouter may experience temporary rate limits or queue delays during peak traffic hours.
- **Google OAuth Setup**: Google SSO requires registering your exact Render backend redirect URL in Google Cloud Console.

---

## License

MIT License.
