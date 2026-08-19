from fastapi import APIRouter

from app.schemas.calculation import CalculationRequest
from app.services.calculator import calculate_school_budget


router = APIRouter(
    prefix="/api",
    tags=["Calculator"],
)


@router.post("/calculate")
def calculate(request: CalculationRequest):
    return calculate_school_budget(request)