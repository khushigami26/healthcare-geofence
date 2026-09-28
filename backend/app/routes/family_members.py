from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient
from app.models.family_member import FamilyMember
from app.schemas.family_member import (
    FamilyMemberCreate,
    FamilyMemberUpdate,
    FamilyMemberResponse
)


router = APIRouter(
    prefix="/api",
    tags=["Family Members"]
)


@router.post(
    "/patients/{patient_id}/family-members",
    response_model=FamilyMemberResponse,
    status_code=status.HTTP_201_CREATED
)
def create_family_member(
    patient_id: int,
    family_member_data: FamilyMemberCreate,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )

    family_member = FamilyMember(
        patient_id=patient_id,
        name=family_member_data.name,
        relationship_with_patient=(
            family_member_data.relationship_with_patient
        ),
        mobile_number=family_member_data.mobile_number,
        email=family_member_data.email,
        notification_preference=(
            family_member_data.notification_preference
        )
    )

    db.add(family_member)
    db.commit()
    db.refresh(family_member)

    return family_member


@router.get(
    "/patients/{patient_id}/family-members",
    response_model=list[FamilyMemberResponse]
)
def get_family_members(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )

    return db.query(FamilyMember).filter(
        FamilyMember.patient_id == patient_id
    ).all()


@router.put(
    "/family-members/{family_member_id}",
    response_model=FamilyMemberResponse
)
def update_family_member(
    family_member_id: int,
    family_member_data: FamilyMemberUpdate,
    db: Session = Depends(get_db)
):
    family_member = db.query(FamilyMember).filter(
        FamilyMember.id == family_member_id
    ).first()

    if not family_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family member not found"
        )

    if family_member_data.name is not None:
        family_member.name = family_member_data.name

    if family_member_data.relationship_with_patient is not None:
        family_member.relationship_with_patient = (
            family_member_data.relationship_with_patient
        )

    if family_member_data.mobile_number is not None:
        family_member.mobile_number = (
            family_member_data.mobile_number
        )

    if family_member_data.email is not None:
        family_member.email = family_member_data.email

    if family_member_data.notification_preference is not None:
        family_member.notification_preference = (
            family_member_data.notification_preference
        )

    db.commit()
    db.refresh(family_member)

    return family_member


@router.delete(
    "/family-members/{family_member_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_family_member(
    family_member_id: int,
    db: Session = Depends(get_db)
):
    family_member = db.query(FamilyMember).filter(
        FamilyMember.id == family_member_id
    ).first()

    if not family_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family member not found"
        )

    db.delete(family_member)
    db.commit()

    return None