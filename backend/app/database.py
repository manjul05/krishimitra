"""PostgreSQL disease database via SQLAlchemy ORM."""

import os
from collections.abc import Generator
from datetime import datetime, timezone
from typing import Optional

from dotenv import load_dotenv
from sqlalchemy import DateTime, Integer, String, create_engine, func, select
from sqlalchemy.orm import Mapped, Session, declarative_base, mapped_column, sessionmaker

from app.models import DiseaseCreate, DiseaseResponse, DiseaseUpdate

load_dotenv()

database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise RuntimeError("DATABASE_URL environment variable is not set")

if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Disease(Base):
    """SQLAlchemy ORM model for crop disease records."""

    __tablename__ = "diseases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    crop: Mapped[str] = mapped_column(String(255), nullable=False)
    disease: Mapped[str] = mapped_column(String(255), nullable=False)
    symptoms: Mapped[str] = mapped_column(String, nullable=False)
    treatment: Mapped[str] = mapped_column(String, nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False)
    image: Mapped[str] = mapped_column(String(512), default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


SEED_DISEASES: list[dict[str, str]] = [
    {
        "crop": "Tomato",
        "disease": "Early Blight",
        "symptoms": "Dark concentric rings on lower leaves, yellowing, leaf drop.",
        "treatment": "Apply copper-based fungicide every 7–10 days. Remove infected leaves.",
        "severity": "High",
        "image": "https://images.unsplash.com/photo-1592924357235-27501db8957b?w=400",
    },
    {
        "crop": "Tomato",
        "disease": "Late Blight",
        "symptoms": "Water-soaked lesions on leaves, white mold on underside, rapid spread.",
        "treatment": "Use chlorothalonil or mancozeb. Improve drainage and air circulation.",
        "severity": "High",
        "image": "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400",
    },
    {
        "crop": "Wheat",
        "disease": "Leaf Rust",
        "symptoms": "Orange-brown pustules on leaves, reduced photosynthesis, stunted growth.",
        "treatment": "Apply propiconazole fungicide. Plant resistant varieties.",
        "severity": "Moderate",
        "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    },
    {
        "crop": "Rice",
        "disease": "Bacterial Leaf Blight",
        "symptoms": "Yellowing leaf tips, wilting, white ooze on cut stems.",
        "treatment": "Use streptomycin spray. Avoid excessive nitrogen fertilization.",
        "severity": "High",
        "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    },
    {
        "crop": "Potato",
        "disease": "Late Blight",
        "symptoms": "Dark lesions on leaves and tubers, foul odor from rotting tubers.",
        "treatment": "Apply metalaxyl + mancozeb. Harvest early if infection is severe.",
        "severity": "High",
        "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
    },
    {
        "crop": "Cotton",
        "disease": "Bacterial Blight",
        "symptoms": "Angular water-soaked spots on leaves, boll rot, defoliation.",
        "treatment": "Spray copper oxychloride. Use certified disease-free seeds.",
        "severity": "Moderate",
        "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    },
    {
        "crop": "Maize",
        "disease": "Gray Leaf Spot",
        "symptoms": "Rectangular gray lesions on leaves, premature leaf death.",
        "treatment": "Apply azoxystrobin fungicide. Rotate crops annually.",
        "severity": "Low",
        "image": "https://images.unsplash.com/photo-1551752495-00570b35d7f9?w=400",
    },
    {
        "crop": "Sugarcane",
        "disease": "Red Rot",
        "symptoms": "Reddish discoloration inside stalks, sour smell, drying of leaves.",
        "treatment": "Remove and burn infected plants. Use heat-treated setts.",
        "severity": "High",
        "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    },
]


def get_db() -> Generator[Session, None, None]:
    """Yield a SQLAlchemy session and ensure it is closed after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create tables and seed sample data when the database is empty."""
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as session:
        count = session.scalar(select(func.count()).select_from(Disease))
        if count == 0:
            now = datetime.now(timezone.utc)
            for item in SEED_DISEASES:
                session.add(Disease(**item, created_at=now))
            session.commit()


def get_all_diseases(db: Session) -> list[DiseaseResponse]:
    """Return all disease records."""
    diseases = db.scalars(select(Disease).order_by(Disease.id)).all()
    return [DiseaseResponse.model_validate(d) for d in diseases]


def get_disease_by_id(db: Session, disease_id: int) -> Optional[DiseaseResponse]:
    """Return a single disease by ID, or None if not found."""
    disease = db.get(Disease, disease_id)
    if disease is None:
        return None
    return DiseaseResponse.model_validate(disease)


def create_disease(db: Session, payload: DiseaseCreate) -> DiseaseResponse:
    """Insert a new disease record and return it."""
    disease = Disease(**payload.model_dump())
    db.add(disease)
    db.commit()
    db.refresh(disease)
    return DiseaseResponse.model_validate(disease)


def update_disease(
    db: Session, disease_id: int, payload: DiseaseUpdate
) -> Optional[DiseaseResponse]:
    """Update an existing disease record. Returns None if not found."""
    disease = db.get(Disease, disease_id)
    if disease is None:
        return None

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(disease, field, value)

    db.commit()
    db.refresh(disease)
    return DiseaseResponse.model_validate(disease)


def delete_disease(db: Session, disease_id: int) -> bool:
    """Delete a disease record. Returns True if deleted, False if not found."""
    disease = db.get(Disease, disease_id)
    if disease is None:
        return False

    db.delete(disease)
    db.commit()
    return True


def get_disease_by_name(db: Session, disease_name: str) -> Optional[DiseaseResponse]:
    """Return a disease record by exact name (case-insensitive), or None if not found."""
    query = disease_name.strip().lower()
    if not query:
        return None

    record = db.scalar(
        select(Disease).where(func.lower(Disease.disease) == query).limit(1)
    )
    if record is None:
        return None
    return DiseaseResponse.model_validate(record)


def search_by_crop(db: Session, crop: str) -> list[DiseaseResponse]:
    """Search diseases by crop name (case-insensitive partial match)."""
    query = crop.strip().lower()
    diseases = db.scalars(
        select(Disease)
        .where(func.lower(Disease.crop).contains(query))
        .order_by(Disease.id)
    ).all()
    return [DiseaseResponse.model_validate(d) for d in diseases]


def get_stats(db: Session) -> dict[str, int]:
    """Compute dashboard statistics from the database."""
    total_diseases = db.scalar(select(func.count()).select_from(Disease)) or 0
    crop_count = (
        db.scalar(select(func.count(func.distinct(func.lower(Disease.crop)))).select_from(Disease))
        or 0
    )
    high_severity_count = (
        db.scalar(
            select(func.count())
            .select_from(Disease)
            .where(func.lower(Disease.severity) == "high")
        )
        or 0
    )
    return {
        "total_diseases": total_diseases,
        "crop_count": crop_count,
        "high_severity_count": high_severity_count,
    }
