from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient
from app.models.patient_location import PatientLocation
from app.schemas.location import (
    LocationCreate,
    LocationUpdate,
    LocationResponse
)


router = APIRouter(
    prefix="/api",
    tags=["Locations"]
)


@router.post(
    "/patients/{patient_id}/locations",
    response_model=LocationResponse,
    status_code=status.HTTP_201_CREATED
)
def create_location(
    patient_id: int,
    location_data: LocationCreate,
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

    location = PatientLocation(
        patient_id=patient_id,
        location_name=location_data.location_name,
        address=location_data.address,
        latitude=location_data.latitude,
        longitude=location_data.longitude,
        geo_fence_radius=location_data.geo_fence_radius,
        is_active=False
    )

    db.add(location)
    db.commit()
    db.refresh(location)

    return location


@router.get(
    "/patients/{patient_id}/locations",
    response_model=list[LocationResponse]
)
def get_locations(
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

    return db.query(PatientLocation).filter(
        PatientLocation.patient_id == patient_id
    ).all()


@router.put(
    "/locations/{location_id}",
    response_model=LocationResponse
)
def update_location(
    location_id: int,
    location_data: LocationUpdate,
    db: Session = Depends(get_db)
):
    location = db.query(PatientLocation).filter(
        PatientLocation.id == location_id
    ).first()

    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )

    if location_data.location_name is not None:
        location.location_name = location_data.location_name

    if location_data.address is not None:
        location.address = location_data.address

    if location_data.latitude is not None:
        location.latitude = location_data.latitude

    if location_data.longitude is not None:
        location.longitude = location_data.longitude

    if location_data.geo_fence_radius is not None:
        location.geo_fence_radius = (
            location_data.geo_fence_radius
        )

    db.commit()
    db.refresh(location)

    return location


@router.delete(
    "/locations/{location_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_location(
    location_id: int,
    db: Session = Depends(get_db)
):
    location = db.query(PatientLocation).filter(
        PatientLocation.id == location_id
    ).first()

    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )

    db.delete(location)
    db.commit()

    return None


@router.put(
    "/locations/{location_id}/activate",
    response_model=LocationResponse
)
def activate_location(
    location_id: int,
    db: Session = Depends(get_db)
):
    location = db.query(PatientLocation).filter(
        PatientLocation.id == location_id
    ).first()

    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )

    active_location = db.query(PatientLocation).filter(
        PatientLocation.patient_id == location.patient_id,
        PatientLocation.is_active == True,
        PatientLocation.id != location_id
    ).first()

    if active_location:
        active_location.is_active = False

    location.is_active = True

    db.commit()
    db.refresh(location)

    return location


@router.put(
    "/locations/{location_id}/deactivate",
    response_model=LocationResponse
)
def deactivate_location(
    location_id: int,
    db: Session = Depends(get_db)
):
    location = db.query(PatientLocation).filter(
        PatientLocation.id == location_id
    ).first()

    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )

    location.is_active = False

    db.commit()
    db.refresh(location)

    return location