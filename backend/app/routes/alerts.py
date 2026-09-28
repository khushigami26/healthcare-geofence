from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient
from app.models.alert import Alert
from app.schemas.alert import AlertResponse


router = APIRouter(
    prefix="/api",
    tags=["Alerts"]
)


@router.get(
    "/patients/{patient_id}/alerts",
    response_model=list[AlertResponse]
)
def get_patient_alerts(
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

    return db.query(Alert).filter(
        Alert.patient_id == patient_id
    ).order_by(
        Alert.created_date.desc()
    ).all()


@router.put(
    "/alerts/{alert_id}/read",
    response_model=AlertResponse
)
def mark_alert_as_read(
    alert_id: int,
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(
        Alert.id == alert_id
    ).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )

    alert.status = "Read"

    db.commit()
    db.refresh(alert)

    return alert