"""Pydantic schemas for AI advisor request and response validation."""

from typing import Literal
from pydantic import BaseModel, Field, field_validator


class AdvisorRequest(BaseModel):
    """Schema for validating AI advisor advice request."""

    crop: str = Field(
        ...,
        max_length=50,
        description="Name of the crop (e.g., Tomato)",
    )
    disease: str = Field(
        ...,
        max_length=100,
        description="Name of the detected disease (e.g., Late Blight)",
    )
    language: Literal["english", "hindi"] = Field(
        ...,
        description="Desired advice language: 'english' or 'hindi'",
    )

    @field_validator("crop", "disease")
    @classmethod
    def check_not_empty(cls, v: str, info) -> str:
        """Reject empty or whitespace-only strings."""
        if not v or not v.strip():
            raise ValueError(f"{info.field_name} cannot be empty or whitespace only")
        return v.strip()


class AdvisorData(BaseModel):
    """Schema for structured AI advice fields."""

    disease: str = Field(..., description="Name of the disease (matching the requested name)")
    severity: str = Field(..., description="Severity level (e.g., High, Moderate, Low)")
    cause: str = Field(..., description="Details about the cause of the disease")
    organic_treatment: str = Field(..., description="Recommended organic controls and treatments")
    chemical_treatment: str = Field(..., description="Recommended chemical control and treatments")
    prevention: str = Field(..., description="Preventative measures and agricultural hygiene tips")
    farmer_tips: str = Field(..., description="Practical tips tailored for Indian farmers")


class AdvisorResponse(BaseModel):
    """Standard success response wrapper."""

    success: bool = True
    data: AdvisorData
