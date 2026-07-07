"""KrishiMitra FastAPI application entry point."""

import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app import database as db
from app.routes import router
from app.utils import error_response, global_exception_handler, http_exception_handler

load_dotenv()

APP_NAME = "KrishiMitra API"
APP_VERSION = "1.0.0"

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="AI-Powered Crop Disease Detection & Advisory Platform — REST API",
)

# CORS — allow the Next.js frontend
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(router)

# Error handlers
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    """Return 400 for Pydantic / request validation errors."""
    errors = exc.errors()
    first = errors[0] if errors else {}
    field = " -> ".join(str(loc) for loc in first.get("loc", []))
    msg = first.get("msg", "Validation error")
    message = f"{field}: {msg}" if field else msg
    return error_response(status_code=400, message=message)


@app.on_event("startup")
def on_startup() -> None:
    """Create database tables and seed data on first run."""
    db.init_db()


@app.get("/", tags=["Root"])
def root():
    """Root endpoint with API info."""
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "docs": "/docs",
        "health": "/api/health",
    }
