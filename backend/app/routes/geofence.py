from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient
from app.models.patient_location import PatientLocation
from app.models.geofence_event import GeofenceEvent
from app.models.alert import Alert
from app.schemas.geofence import (
    GeofenceCheckRequest,
    GeofenceCheckResponse
)
from app.services.geofence import check_geofence


router = APIRouter(
    prefix="/api",
    tags=["Geo Fence"]
)


@router.post(
    "/patients/{patient_id}/geofence/check",
    response_model=GeofenceCheckResponse
)
def check_patient_geofence(
    patient_id: int,
    location_data: GeofenceCheckRequest,
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

    active_location = db.query(PatientLocation).filter(
        PatientLocation.patient_id == patient_id,
        PatientLocation.is_active == True
    ).first()

    if not active_location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active location found for patient"
        )

    is_inside, distance = check_geofence(
        current_latitude=location_data.latitude,
        current_longitude=location_data.longitude,
        location_latitude=active_location.latitude,
        location_longitude=active_location.longitude,
        radius=active_location.geo_fence_radius
    )

    event_status = "INSIDE" if is_inside else "OUTSIDE"

    event = GeofenceEvent(
        patient_id=patient_id,
        location_id=active_location.id,
        latitude=location_data.latitude,
        longitude=location_data.longitude,
        distance=distance,
        status=event_status
    )

    db.add(event)

    if event_status == "OUTSIDE":
        alert = Alert(
            patient_id=patient_id,
            location_id=active_location.id,
            message=(
                f"Patient is outside the geo-fence "
                f"of {active_location.location_name}"
            ),
            status="Unread"
        )

        db.add(alert)

    db.commit()

    return GeofenceCheckResponse(
        patient_id=patient_id,
        location_id=active_location.id,
        location_name=active_location.location_name,
        latitude=location_data.latitude,
        longitude=location_data.longitude,
        distance=round(distance, 2),
        radius=active_location.geo_fence_radius,
        status=event_status,
        checked_at=datetime.utcnow()
    )