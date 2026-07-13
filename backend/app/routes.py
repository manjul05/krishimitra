import os
import requests
from fastapi import APIRouter, Depends, File, HTTPException, Query, Request, Response, UploadFile, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
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
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
)
from app.utils import bad_request, not_found
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.limiter import limiter
from app.database import User

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


# ==========================================
# AUTHENTICATION & SECURITY ENDPOINTS
# ==========================================

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "YOUR_GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback")


@router.post(
    "/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Authentication"],
)
# @limiter.limit("5/15 minutes")
def register_user(
    request: Request,
    payload: UserRegister,
    session: Session = Depends(db.get_db),
) -> User:
    """Register a new user after validation, checking duplicates and hashing password."""
    # Check duplicate email
    existing_user = session.scalar(
        select(User).where(User.email == payload.email)
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered",
        )

    # Hash password and save
    hashed = get_password_hash(payload.password)
    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hashed,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user




@router.post(
    "/auth/login",
    response_model=TokenResponse,
    tags=["Authentication"],
)
@limiter.limit("5/15 minutes")
def login_user(
    request: Request,
    payload: UserLogin,
    session: Session = Depends(db.get_db),
) -> dict:
    """Authenticate user and return a JWT access token valid for 7 days."""
    user = session.scalar(
        select(User).where(User.email == payload.email)
    )
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Generate token
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


@router.get(
    "/auth/me",
    response_model=UserResponse,
    tags=["Authentication"],
)
def get_me(
    current_user: User = Depends(get_current_user),
) -> User:
    """Return the currently authenticated user's details."""
    return current_user


@router.get("/auth/google/login", tags=["Google OAuth"])
def google_login():
    """Redirect user's browser to the Google OAuth2 authorization page."""
    # Check if credentials are placeholders
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"response_type=code&"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        f"scope=openid%20email%20profile"
    )
    return RedirectResponse(url=auth_url)


@router.get("/auth/google/callback", tags=["Google OAuth"])
def google_callback(
    code: str,
    session: Session = Depends(db.get_db),
):
    """
    Handle Google OAuth2 callback. Exchange auth code for tokens, retrieve
    user profile details, and log in or register the user.
    """
    # Check if credentials are mock/missing to support seamless local testing
    is_mock = (
        "YOUR_" in GOOGLE_CLIENT_ID or
        "YOUR_" in GOOGLE_CLIENT_SECRET or
        code == "mock_code"
    )

    if is_mock:
        # Simulated user for local development and testing
        google_email = "mock.farmer@gmail.com"
        google_name = "Mock Farmer"
        google_id = "mock_google_user_12345"
    else:
        # Standard exchange flow using requests
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        }
        try:
            token_response = requests.post(token_url, data=data, timeout=10)
            token_response.raise_for_status()
            tokens = token_response.json()

            # Fetch user info using access token
            userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
            headers = {"Authorization": f"Bearer {tokens.get('access_token')}"}
            userinfo_response = requests.get(userinfo_url, headers=headers, timeout=10)
            userinfo_response.raise_for_status()
            userinfo = userinfo_response.json()

            google_email = userinfo.get("email")
            google_name = userinfo.get("name", "Google User")
            google_id = userinfo.get("sub")
        except Exception as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to retrieve Google token/userinfo: {str(exc)}",
            )

    # Register/Login user in the local database
    user = session.scalar(
        select(User).where(User.email == google_email)
    )
    if not user:
        # Create a new user with dummy password (since they are using Google SSO)
        user = User(
            name=google_name,
            email=google_email,
            hashed_password=get_password_hash(f"google-oauth-dummy-pw-{google_id}"),
            google_id=google_id,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    elif not user.google_id:
        # Link Google SSO to existing user if not already linked
        user.google_id = google_id
        session.commit()
        session.refresh(user)

    # Generate local JWT token
    token = create_access_token(data={"sub": user.email})

    # Redirect browser back to the Next.js frontend with the JWT
    frontend_login_url = os.getenv("FRONTEND_URL", "http://localhost:3000") + f"/login?token={token}"
    return RedirectResponse(url=frontend_login_url)

