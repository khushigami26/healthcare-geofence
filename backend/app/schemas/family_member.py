from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class FamilyMemberCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    relationship_with_patient: str = Field(
        ...,
        min_length=2,
        max_length=50
    )

    mobile_number: str = Field(
        ...,
        pattern=r"^\d{10}$",
        description="Mobile number must be exactly 10 digits"
    )

    email: EmailStr

    notification_preference: str = Field(
        default="Enabled",
        min_length=1,
        max_length=30
    )


class FamilyMemberUpdate(BaseModel):
    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    relationship_with_patient: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    mobile_number: Optional[str] = Field(
        default=None,
        pattern=r"^\d{10}$",
        description="Mobile number must be exactly 10 digits"
    )

    email: Optional[EmailStr] = None

    notification_preference: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=30
    )


class FamilyMemberResponse(BaseModel):
    id: int
    patient_id: int
    name: str
    relationship_with_patient: str
    mobile_number: str
    email: str
    notification_preference: str

    class Config:
        from_attributes = True