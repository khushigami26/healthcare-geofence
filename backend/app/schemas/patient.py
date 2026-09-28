from pydantic import BaseModel, Field
from typing import Optional


class PatientCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    mobile_number: str = Field(
        ...,
        pattern=r"^\d{10}$",
        description="Mobile number must be exactly 10 digits"
    )

    status: str = Field(
        default="Active",
        min_length=1,
        max_length=30
    )


class PatientUpdate(BaseModel):
    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    mobile_number: Optional[str] = Field(
        default=None,
        pattern=r"^\d{10}$",
        description="Mobile number must be exactly 10 digits"
    )

    status: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=30
    )


class PatientResponse(BaseModel):
    id: int
    name: str
    mobile_number: str
    status: str

    class Config:
        from_attributes = True