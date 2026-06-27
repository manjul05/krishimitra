"""Utility helpers for the KrishiMitra backend."""

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

from app.models import ErrorResponse


def error_response(status_code: int, message: str) -> JSONResponse:
    """Build a standardized JSON error response."""
    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(message=message).model_dump(),
    )


def not_found(message: str = "Resource not found") -> HTTPException:
    """Raise a 404 HTTPException with a standard message."""
    raise HTTPException(status_code=404, detail=message)


def bad_request(message: str = "Invalid request") -> HTTPException:
    """Raise a 400 HTTPException with a standard message."""
    raise HTTPException(status_code=400, detail=message)


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch unhandled exceptions and return a 500 JSON response."""
    return error_response(
        status_code=500,
        message="Internal server error. Please try again later.",
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Convert HTTPException details into the standard error envelope."""
    detail = exc.detail
    message = detail if isinstance(detail, str) else str(detail)
    return error_response(status_code=exc.status_code, message=message)
