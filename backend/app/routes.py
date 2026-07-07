"""REST API route definitions for KrishiMitra."""

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile, status
from sqlalchemy.orm import Session

from app import database as db
from app.ai_service import AIServiceError, predict_disease
from app.models import (
    DiseaseCreate,
    DiseaseDetails,
    DiseaseResponse,
    DiseaseUpdate,
    HealthResponse,
    PredictResponse,
    PredictionResult,
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
def list_diseases(session: Session = Depends(db.get_db)) -> list[DiseaseResponse]:
    """Return all disease records."""
    return db.get_all_diseases(session)


@router.get(
    "/diseases/{disease_id}",
    response_model=DiseaseResponse,
    tags=["Diseases"],
)
def get_disease(
    disease_id: int, session: Session = Depends(db.get_db)
) -> DiseaseResponse:
    """Return a single disease by ID."""
    disease = db.get_disease_by_id(session, disease_id)
    if disease is None:
        not_found(f"Disease with id {disease_id} not found")
    return disease


@router.post(
    "/diseases",
    response_model=DiseaseResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Diseases"],
)
def create_disease(
    payload: DiseaseCreate, session: Session = Depends(db.get_db)
) -> DiseaseResponse:
    """Create a new disease record."""
    return db.create_disease(session, payload)


@router.put(
    "/diseases/{disease_id}",
    response_model=DiseaseResponse,
    tags=["Diseases"],
)
def update_disease(
    disease_id: int,
    payload: DiseaseUpdate,
    session: Session = Depends(db.get_db),
) -> DiseaseResponse:
    """Update an existing disease record."""
    if not payload.model_dump(exclude_unset=True):
        bad_request("At least one field must be provided for update")

    disease = db.update_disease(session, disease_id, payload)
    if disease is None:
        not_found(f"Disease with id {disease_id} not found")
    return disease


@router.delete(
    "/diseases/{disease_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Diseases"],
)
def delete_disease(
    disease_id: int, session: Session = Depends(db.get_db)
) -> Response:
    """Delete a disease record."""
    deleted = db.delete_disease(session, disease_id)
    if not deleted:
        not_found(f"Disease with id {disease_id} not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/search", response_model=list[DiseaseResponse], tags=["Search"])
def search_diseases(
    crop: str = Query(..., min_length=1, description="Crop name to search"),
    session: Session = Depends(db.get_db),
) -> list[DiseaseResponse]:
    """Search diseases by crop name."""
    return db.search_by_crop(session, crop)


@router.get("/stats", response_model=StatsResponse, tags=["Stats"])
def get_stats(session: Session = Depends(db.get_db)) -> StatsResponse:
    """Return aggregated disease statistics."""
    stats = db.get_stats(session)
    return StatsResponse(**stats)


@router.post(
    "/predict",
    response_model=PredictResponse,
    tags=["AI Detection"],
    responses={
        400: {"description": "No image or invalid image"},
        502: {"description": "OpenRouter API error"},
        503: {"description": "AI service not configured"},
        504: {"description": "OpenRouter timeout"},
    },
)
async def predict_crop_disease(
    image: UploadFile = File(..., description="Crop leaf image (PNG/JPG)"),
    session: Session = Depends(db.get_db),
) -> PredictResponse:
    """
    Analyze an uploaded crop image with OpenRouter Vision, then enrich with
    disease details from PostgreSQL when a matching record exists.
    """
    if not image.filename:
        bad_request("No image uploaded.")

    if image.content_type and not image.content_type.startswith("image/"):
        bad_request("Invalid image file. Please upload a valid PNG or JPG.")

    try:
        image_bytes = await image.read()
    except Exception as exc:
        raise HTTPException(
            status_code=400, detail="Failed to read uploaded image."
        ) from exc

    if not image_bytes:
        bad_request("No image uploaded.")

    try:
        prediction = predict_disease(image_bytes)
    except AIServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    prediction_result = PredictionResult(**prediction)

    try:
        record = db.get_disease_by_name(session, prediction_result.disease)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Database error while looking up disease details.",
        ) from exc

    if record is None:
        return PredictResponse(success=True, prediction=prediction_result)

    return PredictResponse(
        success=True,
        prediction=prediction_result,
        details=DiseaseDetails(
            symptoms=record.symptoms,
            treatment=record.treatment,
            severity=record.severity,
            image=record.image,
        ),
    )
