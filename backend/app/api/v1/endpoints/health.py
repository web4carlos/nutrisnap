from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.session import get_db

router = APIRouter()


@router.get("")
def health_check() -> dict[str, str]:
    return {"status": "healthy", "service": "nutrisnap-api"}


@router.get("/ready")
def readiness_check(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {
        "status": "ready",
        "service": "nutrisnap-api",
        "database": "connected",
    }
