from pydantic import BaseModel, Field


class ExpenseOverrides(BaseModel):
    teacherSalaries: float | None = Field(None, ge=0)
    adminStaff: float | None = Field(None, ge=0)
    electricity: float | None = Field(None, ge=0)
    water: float | None = Field(None, ge=0)
    stationery: float | None = Field(None, ge=0)
    maintenance: float | None = Field(None, ge=0)
    rent: float | None = Field(None, ge=0)


class CalculationRequest(BaseModel):
    totalStudents: int = Field(..., ge=0)
    feePerMonth: float = Field(..., ge=0)
    numTeachers: int = Field(..., ge=0)
    rentInput: float = Field(..., ge=0)
    overrides: ExpenseOverrides | None = None