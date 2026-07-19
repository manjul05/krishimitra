"""OpenRouter Vision AI service for crop disease prediction."""

import base64
import json
import os
import re
import logging
from io import BytesIO
from typing import Any

import requests
from dotenv import load_dotenv
from PIL import Image, UnidentifiedImageError

load_dotenv()

# Logger setup
logger = logging.getLogger("krishimitra.vision")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")
OPENROUTER_TIMEOUT_SECONDS = int(os.getenv("OPENROUTER_TIMEOUT_SECONDS", "60"))
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT = """You are an expert agricultural scientist.

Analyze the uploaded crop image.

Identify:
- Crop (the name of the crop, e.g. Tomato)
- Disease (the name of the disease, e.g. Late Blight, or 'Healthy' if no disease is found)
- Confidence percentage (integer 0-100)

Return ONLY valid JSON.

Example:
{
  "crop": "Tomato",
  "disease": "Early Blight",
  "confidence": 96
}

No markdown.
No explanation."""

MIME_BY_FORMAT: dict[str, str] = {
    "JPEG": "image/jpeg",
    "PNG": "image/png",
    "WEBP": "image/webp",
    "GIF": "image/gif",
    "BMP": "image/bmp",
}


class AIServiceError(Exception):
    """Base exception for AI service failures."""

    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class InvalidImageError(AIServiceError):
    """Raised when uploaded bytes are not a valid image."""

    def __init__(self, message: str = "Invalid image file. Please upload a valid PNG or JPG."):
        super().__init__(message, status_code=400)


class OpenRouterTimeoutError(AIServiceError):
    """Raised when OpenRouter API times out."""

    def __init__(self, message: str = "AI analysis timed out. Please try again."):
        super().__init__(message, status_code=504)


class OpenRouterAPIError(AIServiceError):
    """Raised when OpenRouter API returns an error."""

    def __init__(self, message: str = "AI service unavailable. Please try again later."):
        super().__init__(message, status_code=502)


class OpenRouterQuotaError(AIServiceError):
    """Raised when OpenRouter credits or rate limits are exceeded."""

    def __init__(self, message: str = "OpenRouter quota or rate limit exceeded. Please check credits."):
        super().__init__(message, status_code=429)


class OpenRouterAuthError(AIServiceError):
    """Raised when OpenRouter API key is invalid or unauthorized."""

    def __init__(self, message: str = "OpenRouter authentication failed. Please verify API key."):
        super().__init__(message, status_code=401)


class OpenRouterModelError(AIServiceError):
    """Raised when the specified model is invalid or unavailable."""

    def __init__(self, message: str = "OpenRouter model unavailable or invalid."):
        super().__init__(message, status_code=400)


def _ensure_api_key() -> None:
    """Verify OpenRouter API key is configured."""
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY.strip() in ("", "YOUR_OPENROUTER_API_KEY"):
        raise AIServiceError(
            "OPENROUTER_API_KEY is not configured on the server.",
            status_code=503,
        )


def _extract_prediction_fields(data: dict) -> dict[str, Any]:
    """Helper to extract, clean, and validate expected JSON fields."""
    crop = str(data.get("crop", "")).strip()
    disease = str(data.get("disease", "")).strip()
    confidence_raw = data.get("confidence", 0)

    try:
        confidence = int(round(float(confidence_raw)))
    except (TypeError, ValueError):
        confidence = 0

    confidence = max(0, min(100, confidence))

    if not crop or not disease:
        raise OpenRouterAPIError(
            "AI could not identify the crop or disease. Please try another image."
        )

    return {"crop": crop, "disease": disease, "confidence": confidence}


def _parse_prediction_json(raw_text: str) -> dict[str, Any]:
    """Extract and parse JSON from OpenRouter response text, handling surrounding text or markdown code fences."""
    text = raw_text.strip()

    # 1. Try direct parsing first
    try:
        data = json.loads(text)
        return _extract_prediction_fields(data)
    except Exception:
        pass

    # 2. Try to search for content inside triple backticks markdown fences
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text, re.IGNORECASE)
    if fence_match:
        try:
            data = json.loads(fence_match.group(1).strip())
            return _extract_prediction_fields(data)
        except Exception:
            pass

    # 3. Try to find the first '{' and last '}' in the entire text and parse that substring
    json_match = re.search(r"({[\s\S]*})", text)
    if json_match:
        try:
            data = json.loads(json_match.group(1).strip())
            return _extract_prediction_fields(data)
        except Exception:
            pass

    # If all parsing attempts fail, raise custom error
    raise OpenRouterAPIError("AI returned an invalid response. Please try again.")


def validate_image(image_bytes: bytes) -> tuple[Image.Image, str]:
    """Validate image bytes and return a PIL Image with its MIME type."""
    if not image_bytes:
        raise InvalidImageError("No image data received.")

    try:
        image = Image.open(BytesIO(image_bytes))
        image.load()
    except Exception as exc:
        raise InvalidImageError() from exc

    if image.format not in MIME_BY_FORMAT:
        raise InvalidImageError("Unsupported image format. Please upload PNG, JPG, or WEBP.")

    return image, MIME_BY_FORMAT[image.format]


def _image_to_base64_data_url(image_bytes: bytes) -> str:
    """Convert validated image bytes to a base64 data URL for OpenRouter."""
    _, mime_type = validate_image(image_bytes)
    encoded = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


def predict_disease(image_bytes: bytes) -> dict[str, Any]:
    """
    Analyze a crop image with OpenRouter Vision and return prediction.

    Returns:
        {"crop": str, "disease": str, "confidence": int}
    """
    _ensure_api_key()
    image_data_url = _image_to_base64_data_url(image_bytes)

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Analyze this crop image."},
                    {"type": "image_url", "image_url": {"url": image_data_url}},
                ],
            },
        ],
    }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "KrishiMitra",
    }

    logger.info("Calling OpenRouter API using model: %s", OPENROUTER_MODEL)

    try:
        response = requests.post(
            OPENROUTER_API_URL,
            headers=headers,
            json=payload,
            timeout=OPENROUTER_TIMEOUT_SECONDS,
        )
    except requests.Timeout as exc:
        logger.error("OpenRouter API request timed out after %d seconds.", OPENROUTER_TIMEOUT_SECONDS)
        raise OpenRouterTimeoutError() from exc
    except requests.RequestException as exc:
        logger.error("OpenRouter API request failed: %s", str(exc))
        raise OpenRouterAPIError("OpenRouter is unavailable. Please try again later.") from exc

    if response.status_code != 200:
        logger.error(
            "OpenRouter API error: status_code=%d, model=%s, headers=%s, body=%s",
            response.status_code,
            OPENROUTER_MODEL,
            response.headers,
            response.text
        )

        detail = "AI service unavailable. Please try again later."
        try:
            body = response.json()
            if isinstance(body, dict) and body.get("error"):
                error = body["error"]
                if isinstance(error, dict) and error.get("message"):
                    detail = str(error["message"])
                elif isinstance(error, str):
                    detail = error
        except (ValueError, TypeError):
            pass

        # Handle specific error status codes
        if response.status_code == 401:
            raise OpenRouterAuthError(f"OpenRouter authentication failed: {detail}")
        elif response.status_code in (429, 402):
            raise OpenRouterQuotaError(f"OpenRouter quota/rate limit exceeded: {detail}")
        elif response.status_code in (400, 404):
            raise OpenRouterModelError(f"OpenRouter model error: {detail}")
        else:
            raise OpenRouterAPIError(f"OpenRouter API error: {detail}")

    try:
        data = response.json()
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError, ValueError) as exc:
        logger.error("Failed to extract content from OpenRouter response: %s", response.text)
        raise OpenRouterAPIError("AI returned an empty response. Please try again.") from exc

    if not content or not str(content).strip():
        logger.error("OpenRouter returned empty message choices: %s", response.text)
        raise OpenRouterAPIError("AI returned an empty response. Please try again.")

    logger.info("Successfully received prediction content from OpenRouter: %s", content)
    return _parse_prediction_json(str(content))
