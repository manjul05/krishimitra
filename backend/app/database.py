"""In-memory disease database with seed data."""

from datetime import datetime, timezone
from typing import Optional

from app.models import DiseaseCreate, DiseaseResponse, DiseaseUpdate

# Mutable in-memory store — replaced by a real DB in production.
_diseases: list[dict] = []
_next_id: int = 1


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _seed_data() -> None:
    """Populate the in-memory store with sample disease records."""
    global _next_id

    seeds = [
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

    now = _utc_now()
    for item in seeds:
        _diseases.append({**item, "id": _next_id, "created_at": now})
        _next_id += 1


def init_db() -> None:
    """Initialize the in-memory database with seed data if empty."""
    if not _diseases:
        _seed_data()


def get_all_diseases() -> list[DiseaseResponse]:
    """Return all disease records."""
    return [DiseaseResponse(**d) for d in _diseases]


def get_disease_by_id(disease_id: int) -> Optional[DiseaseResponse]:
    """Return a single disease by ID, or None if not found."""
    for d in _diseases:
        if d["id"] == disease_id:
            return DiseaseResponse(**d)
    return None


def create_disease(payload: DiseaseCreate) -> DiseaseResponse:
    """Insert a new disease record and return it."""
    global _next_id

    record = {
        **payload.model_dump(),
        "id": _next_id,
        "created_at": _utc_now(),
    }
    _next_id += 1
    _diseases.append(record)
    return DiseaseResponse(**record)


def update_disease(disease_id: int, payload: DiseaseUpdate) -> Optional[DiseaseResponse]:
    """Update an existing disease record. Returns None if not found."""
    for i, d in enumerate(_diseases):
        if d["id"] == disease_id:
            updates = payload.model_dump(exclude_unset=True)
            _diseases[i] = {**d, **updates}
            return DiseaseResponse(**_diseases[i])
    return None


def delete_disease(disease_id: int) -> bool:
    """Delete a disease record. Returns True if deleted, False if not found."""
    global _diseases
    original_len = len(_diseases)
    _diseases = [d for d in _diseases if d["id"] != disease_id]
    return len(_diseases) < original_len


def search_by_crop(crop: str) -> list[DiseaseResponse]:
    """Search diseases by crop name (case-insensitive partial match)."""
    query = crop.strip().lower()
    return [
        DiseaseResponse(**d)
        for d in _diseases
        if query in d["crop"].lower()
    ]


def get_stats() -> dict[str, int]:
    """Compute dashboard statistics from the in-memory store."""
    unique_crops = {d["crop"].lower() for d in _diseases}
    high_severity = sum(
        1 for d in _diseases if d["severity"].lower() == "high"
    )
    return {
        "total_diseases": len(_diseases),
        "crop_count": len(unique_crops),
        "high_severity_count": high_severity,
    }
