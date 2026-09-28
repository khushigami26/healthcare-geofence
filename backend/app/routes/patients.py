from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient
from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse
)


router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"]
)


# Create patient
@router.post(
    "",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED
)
def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db)
):
    patient = Patient(
        name=patient_data.name,
        mobile_number=patient_data.mobile_number,
        status=patient_data.status
    )

    try:
        db.add(patient)
        db.commit()
        db.refresh(patient)

        return patient

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create patient"
        )


# Get all patients
@router.get(
    "",
    response_model=list[PatientResponse]
)
def get_patients(
    db: Session = Depends(get_db)
):
    patients = db.query(Patient).order_by(
        Patient.id.desc()
    ).all()

    return patients


# Get patient by ID
@router.get(
    "/{patient_id}",
    response_model=PatientResponse
)
def get_patient(
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

    return patient


# Update patient
@router.put(
    "/{patient_id}",
    response_model=PatientResponse
)
def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
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

    if patient_data.name is not None:
        patient.name = patient_data.name

    if patient_data.mobile_number is not None:
        patient.mobile_number = patient_data.mobile_number

    if patient_data.status is not None:
        patient.status = patient_data.status

    try:
        db.commit()
        db.refresh(patient)

        return patient

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update patient"
        )


# Delete patient
@router.delete(
    "/{patient_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_patient(
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

    try:
        db.delete(patient)
        db.commit()

        return None

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete patient"
        )