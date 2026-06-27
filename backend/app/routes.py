"""REST API route definitions for KrishiMitra."""

from fastapi import APIRouter, Query, Response, status

from app import database as db
from app.models import (
    DiseaseCreate,
    DiseaseResponse,
    DiseaseUpdate,
    HealthResponse,
    StatsResponse,
)
from app.utils import bad_request, not_found

router = APIRouter(prefix="/api")


@router.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check() -> HealthResponse:
    """Verify that the backend is running."""
    return HealthResponse(
        status="healthy",
        message="KrishiMitra Backend Running",
    )


@router.get("/diseases", response_model=list[DiseaseResponse], tags=["Diseases"])
def list_diseases() -> list[DiseaseResponse]:
    """Return all disease records."""
    return db.get_all_diseases()


@router.get(
    "/diseases/{disease_id}",
    response_model=DiseaseResponse,
    tags=["Diseases"],
)
def get_disease(disease_id: int) -> DiseaseResponse:
    """Return a single disease by ID."""
    disease = db.get_disease_by_id(disease_id)
    if disease is None:
        not_found(f"Disease with id {disease_id} not found")
    return disease


@router.post(
    "/diseases",
    response_model=DiseaseResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Diseases"],
)
def create_disease(payload: DiseaseCreate) -> DiseaseResponse:
    """Create a new disease record."""
    return db.create_disease(payload)


@router.put(
    "/diseases/{disease_id}",
    response_model=DiseaseResponse,
    tags=["Diseases"],
)
def update_disease(disease_id: int, payload: DiseaseUpdate) -> DiseaseResponse:
    """Update an existing disease record."""
    if not payload.model_dump(exclude_unset=True):
        bad_request("At least one field must be provided for update")

    disease = db.update_disease(disease_id, payload)
    if disease is None:
        not_found(f"Disease with id {disease_id} not found")
    return disease


@router.delete(
    "/diseases/{disease_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Diseases"],
)
def delete_disease(disease_id: int) -> Response:
    """Delete a disease record."""
    deleted = db.delete_disease(disease_id)
    if not deleted:
        not_found(f"Disease with id {disease_id} not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/search", response_model=list[DiseaseResponse], tags=["Search"])
def search_diseases(
    crop: str = Query(..., min_length=1, description="Crop name to search"),
) -> list[DiseaseResponse]:
    """Search diseases by crop name."""
    return db.search_by_crop(crop)


@router.get("/stats", response_model=StatsResponse, tags=["Stats"])
def get_stats() -> StatsResponse:
    """Return aggregated disease statistics."""
    stats = db.get_stats()
    return StatsResponse(**stats)
