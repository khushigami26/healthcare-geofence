from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    ForeignKey,
    Index
)

from app.database import Base


class GeofenceEvent(Base):
    __tablename__ = "geofence_events"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        ForeignKey(
            "patients.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    location_id = Column(
        Integer,
        ForeignKey(
            "patient_locations.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    latitude = Column(
        Float,
        nullable=False
    )

    longitude = Column(
        Float,
        nullable=False
    )

    distance = Column(
        Float,
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False
    )

    created_date = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    __table_args__ = (
        Index(
            "ix_geofence_events_patient_id",
            "patient_id"
        ),
    )