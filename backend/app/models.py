"""Pydantic models for disease data validation and serialization."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


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
