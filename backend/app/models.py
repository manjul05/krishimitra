"""Pydantic models for disease data validation and serialization."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class DiseaseBase(BaseModel):
    """Shared fields for disease records."""

    crop: str = Field(..., min_length=1, description="Crop name (e.g. Tomato)")
    disease: str = Field(..., min_length=1, description="Disease name")
    symptoms: str = Field(..., min_length=1, description="Observed symptoms")
    treatment: str = Field(..., min_length=1, description="Recommended treatment")
    severity: str = Field(..., min_length=1, description="Severity level")
    image: str = Field(default="", description="Image URL or path")


class DiseaseCreate(DiseaseBase):
    """Payload for creating a new disease record."""

    pass


class DiseaseUpdate(BaseModel):
    """Payload for partial disease updates — all fields optional."""

    crop: Optional[str] = Field(None, min_length=1)
    disease: Optional[str] = Field(None, min_length=1)
    symptoms: Optional[str] = Field(None, min_length=1)
    treatment: Optional[str] = Field(None, min_length=1)
    severity: Optional[str] = Field(None, min_length=1)
    image: Optional[str] = None


class DiseaseResponse(DiseaseBase):
    """Disease record returned by the API."""

    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    message: str


class StatsResponse(BaseModel):
    """Dashboard statistics response."""

    total_diseases: int
    crop_count: int
    high_severity_count: int


class ErrorResponse(BaseModel):
    """Standard error response envelope."""

    success: bool = False
    message: str


class PredictionResult(BaseModel):
    """AI disease prediction from OpenRouter Vision."""

    crop: str
    disease: str
    confidence: int = Field(..., ge=0, le=100)


class DiseaseDetails(BaseModel):
    """Disease advisory details from the database."""

    symptoms: str
    treatment: str
    severity: str
    image: str


class PredictResponse(BaseModel):
    """Response for POST /api/predict."""

    success: bool = True
    prediction: PredictionResult
    details: Optional[DiseaseDetails] = None


class UserRegister(BaseModel):
    """Schema for user registration request."""

    name: str = Field(..., min_length=1, description="User's full name")
    email: str = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")

    @classmethod
    def validate_email(cls, email: str) -> str:
        import re
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email):
            raise ValueError("Invalid email address format")
        return email

    # We use a Pydantic model validator or field_validator to check the email format
    @field_validator("email")
    @classmethod
    def check_email(cls, v: str) -> str:
        return cls.validate_email(v)


class UserLogin(BaseModel):
    """Schema for user login request."""

    email: str = Field(..., description="User's email address")
    password: str = Field(..., description="Password")


class TokenResponse(BaseModel):
    """Schema for login response containing JWT token."""

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Schema for user info returned by the API."""

    id: int
    name: str
    email: str
    google_id: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

