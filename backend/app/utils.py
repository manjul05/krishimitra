"""Utility helpers for the KrishiMitra backend."""

import logging
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

from app.models import ErrorResponse

logger = logging.getLogger("krishimitra.errors")


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
    """Catch unhandled exceptions, log details securely, and return standard 500 JSON response."""
    logger.error("Unhandled exception processing request %s: %s", request.url.path, exc, exc_info=True)
    return error_response(
        status_code=500,
        message="An unexpected server error occurred. Please try again later.",
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Convert HTTPException details into the standard error envelope."""
    detail = exc.detail
    message = detail if isinstance(detail, str) else str(detail)
    return error_response(status_code=exc.status_code, message=message)
