from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Index
)

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"


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

    message = Column(
        String(255),
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False,
        default="Unread"
    )

    created_date = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    __table_args__ = (
        Index(
            "ix_alerts_patient_id",
            "patient_id"
        ),
    )