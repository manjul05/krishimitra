"""Groq AI advisory service for crop disease treatment and advice."""

import json
import logging
import os
from typing import Any, Dict
from dotenv import load_dotenv
from groq import AsyncGroq, APIConnectionError, RateLimitError, APIStatusError

load_dotenv()

# Log setup
logger = logging.getLogger("krishimitra.groq")

# Configs
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_FALLBACK_MODEL = "llama3-70b-8192"


class GroqServiceError(Exception):
    """Exception raised when Groq service fails or returns invalid output."""

    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


async def generate_crop_advice(crop: str, disease: str, language: str) -> Dict[str, Any]:
    """
    Generate professional agricultural advice using the Groq API.
    
    Tries the primary model first (llama-3.3-70b-versatile),
    and falls back to llama3-70b-8192 if the call fails due to unavailability/rate limits.
    """
    if not GROQ_API_KEY or GROQ_API_KEY.strip() in ("", "YOUR_API_KEY", "YOUR_GROQ_API_KEY"):
        logger.error("GROQ_API_KEY environment variable is not configured or is a placeholder.")
        raise GroqServiceError("Groq API key not configured on server", status_code=503)

    system_prompt = (
        "You are an experienced agricultural scientist and farming advisor. "
        "The crop disease has already been detected by the CNN model. "
        "Never diagnose diseases, never change the disease name, and never invent another disease. "
        "Provide accurate, practical farming guidance and recommendations in simple language. "
        "Keep advice useful for Indian farmers. "
        "You must return the response only as a valid, structured JSON object with the exact fields specified below. "
        "Do not include any markdown styling, explanation, backticks (such as ```json), or text outside the JSON object. "
        "The response content must be translated or explained in the requested language (either 'english' or 'hindi').\n\n"
        "Required JSON Fields:\n"
        "{\n"
        '  "disease": "string (the exact disease name provided)",\n'
        '  "severity": "string (High, Moderate, or Low)",\n'
        '  "cause": "string (detailed explanation of the cause)",\n'
        '  "organic_treatment": "string (detailed organic control options)",\n'
        '  "chemical_treatment": "string (detailed chemical control options)",\n'
        '  "prevention": "string (detailed preventative guidelines)",\n'
        '  "farmer_tips": "string (practical suggestions for Indian farmers)"\n'
        "}"
    )

    user_prompt = (
        f"Crop: {crop}\n"
        f"Disease: {disease}\n"
        f"Language: {language}\n"
        f"Generate practical farming advice."
    )

    client = AsyncGroq(api_key=GROQ_API_KEY)

    # List of models to try
    models_to_try = [GROQ_MODEL, GROQ_FALLBACK_MODEL]

    for model_name in models_to_try:
        try:
            logger.info("Generating advice with Groq model '%s' (language: %s)", model_name, language)
            
            chat_completion = await client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=model_name,
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=2048
            )
            
            content = chat_completion.choices[0].message.content
            if not content or not content.strip():
                raise GroqServiceError("Empty response returned from Groq.", status_code=502)

            return _parse_and_validate_response(content, disease)

        except RateLimitError as e:
            logger.warning("Rate limit hit for model %s: %s", model_name, str(e))
            if model_name == models_to_try[-1]:
                raise GroqServiceError("Groq API rate limit exceeded.", status_code=429) from e

        except APIStatusError as e:
            logger.warning("API status error with model %s: code=%s, detail=%s", model_name, e.status_code, str(e))
            if model_name == models_to_try[-1]:
                if e.status_code == 401:
                    raise GroqServiceError("Invalid Groq API key configuration.", status_code=401) from e
                raise GroqServiceError(f"Groq API returned status {e.status_code}.", status_code=e.status_code) from e

        except APIConnectionError as e:
            logger.warning("API connection failure for model %s: %s", model_name, str(e))
            if model_name == models_to_try[-1]:
                raise GroqServiceError("Groq API connection timed out or failed.", status_code=504) from e

        except json.JSONDecodeError as e:
            logger.warning("Failed to decode JSON response from model %s: %s", model_name, str(e))
            if model_name == models_to_try[-1]:
                raise GroqServiceError("Malformed AI response received.", status_code=502) from e

        except Exception as e:
            logger.warning("Unexpected error with model %s: %s", model_name, str(e))
            if model_name == models_to_try[-1]:
                raise GroqServiceError(str(e), status_code=500) from e


def _parse_and_validate_response(raw_content: str, expected_disease: str) -> Dict[str, Any]:
    """Parse raw content string to JSON and validate presence and contents of fields."""
    data = json.loads(raw_content)

    required_fields = [
        "disease",
        "severity",
        "cause",
        "organic_treatment",
        "chemical_treatment",
        "prevention",
        "farmer_tips",
    ]

    # Validate all fields exist
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        logger.error("AI response missing fields: %s", missing_fields)
        raise GroqServiceError("Missing JSON fields in AI response.", status_code=502)

    # Validate no field is empty
    for field in required_fields:
        val = data[field]
        if not val or not str(val).strip():
            logger.error("AI response field '%s' is empty or whitespace", field)
            raise GroqServiceError(f"Validation Error: Field '{field}' is empty.", status_code=502)

    # Rule: Never change disease name
    data["disease"] = expected_disease

    return data
