from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Index
)
from sqlalchemy.orm import relationship

from app.database import Base


class PatientLocation(Base):
    __tablename__ = "patient_locations"

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

    location_name = Column(
        String(100),
        nullable=False
    )

    address = Column(
        String(255),
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

    geo_fence_radius = Column(
        Float,
        nullable=False
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=False
    )

    created_date = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    patient = relationship(
        "Patient",
        back_populates="locations"
    )

    __table_args__ = (
        Index(
            "ix_patient_locations_patient_id",
            "patient_id"
        ),
    )