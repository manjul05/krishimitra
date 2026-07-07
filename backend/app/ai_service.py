"""OpenRouter Vision AI service for crop disease prediction."""

import base64
import json
import os
import re
from io import BytesIO
from typing import Any

import requests
from dotenv import load_dotenv
from PIL import Image, UnidentifiedImageError

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")
OPENROUTER_TIMEOUT_SECONDS = int(os.getenv("OPENROUTER_TIMEOUT_SECONDS", "60"))
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT = """You are an expert agricultural scientist.

Analyze the uploaded crop image.

Identify:

Crop

Disease

Confidence percentage

Return ONLY valid JSON.

Example:

{
"crop":"Tomato",
"disease":"Early Blight",
"confidence":96
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


def _ensure_api_key() -> None:
    """Verify OpenRouter API key is configured."""
    if not OPENROUTER_API_KEY:
        raise AIServiceError(
            "OPENROUTER_API_KEY is not configured on the server.",
            status_code=503,
        )


def _parse_prediction_json(raw_text: str) -> dict[str, Any]:
    """Extract and parse JSON from OpenRouter response text."""
    text = raw_text.strip()

    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text, re.IGNORECASE)
    if fence_match:
        text = fence_match.group(1).strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise OpenRouterAPIError("AI returned an invalid response. Please try again.") from exc

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


def validate_image(image_bytes: bytes) -> tuple[Image.Image, str]:
    """Validate image bytes and return a PIL Image with its MIME type."""
    if not image_bytes:
        raise InvalidImageError("No image data received.")

    try:
        image = Image.open(BytesIO(image_bytes))
        image.load()
    except UnidentifiedImageError as exc:
        raise InvalidImageError() from exc
    except Exception as exc:
        raise InvalidImageError() from exc

    if image.format not in MIME_BY_FORMAT:
        raise InvalidImageError("Unsupported image format. Please upload PNG or JPG.")

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

    try:
        response = requests.post(
            OPENROUTER_API_URL,
            headers=headers,
            json=payload,
            timeout=OPENROUTER_TIMEOUT_SECONDS,
        )
    except requests.Timeout as exc:
        raise OpenRouterTimeoutError() from exc
    except requests.RequestException as exc:
        raise OpenRouterAPIError("OpenRouter is unavailable. Please try again later.") from exc

    if response.status_code != 200:
        detail = "OpenRouter API error. Please try again later."
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
        raise OpenRouterAPIError(detail)

    try:
        data = response.json()
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError, ValueError) as exc:
        raise OpenRouterAPIError("AI returned an empty response. Please try again.") from exc

    if not content or not str(content).strip():
        raise OpenRouterAPIError("AI returned an empty response. Please try again.")

    return _parse_prediction_json(str(content))
