"""FastAPI router for AI advisor endpoints."""

import logging
import time
from typing import Any
from fastapi import APIRouter

from app.schemas.ai import AdvisorRequest, AdvisorResponse
from app.services.ai_service import generate_crop_advice, GroqServiceError
from app.utils import error_response

# Logger setup
logger = logging.getLogger("krishimitra.ai")

router = APIRouter(prefix="/ai", tags=["AI Advisor"])


@router.post(
    "/advisor",
    response_model=AdvisorResponse,
    responses={
        400: {"description": "Validation error or empty fields"},
        401: {"description": "Invalid API Key"},
        429: {"description": "Rate limit exceeded"},
        502: {"description": "Malformed AI response or missing JSON fields"},
        504: {"description": "Timeout or connection failure"},
        500: {"description": "Internal server error"},
    },
)
async def get_advisor_advice(payload: AdvisorRequest) -> Any:
    """
    Generate professional agricultural advice for a crop and detected disease.
    
    Accepts crop, disease, and language directly in the request body as JSON.
    """
    logger.info("Incoming AI Advisor request: crop=%s, disease=%s, language=%s", 
                payload.crop, payload.disease, payload.language)
    start_time = time.time()

    # Call AI service and handle errors
    try:
        advice_data = await generate_crop_advice(
            crop=payload.crop,
            disease=payload.disease,
            language=payload.language
        )
        duration = time.time() - start_time
        logger.info(
            "AI Advisor successfully generated advice in %.2f seconds for crop=%s, disease=%s",
            duration,
            payload.crop,
            payload.disease
        )
        return AdvisorResponse(success=True, data=advice_data)

    except GroqServiceError as exc:
        duration = time.time() - start_time
        logger.error(
            "GroqServiceError in advisor route after %.2f seconds: status=%d message=%s",
            duration,
            exc.status_code,
            exc.message
        )
        return error_response(
            status_code=exc.status_code,
            message="Unable to generate AI response."
        )

    except Exception as exc:
        duration = time.time() - start_time
        logger.error(
            "Unhandled exception in advisor route after %.2f seconds: %s",
            duration,
            str(exc)
        )
        return error_response(
            status_code=500,
            message="Unable to generate AI response."
        )
