from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Index
)
from sqlalchemy.orm import relationship

from app.database import Base


class FamilyMember(Base):
    __tablename__ = "family_members"

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

    name = Column(
        String(100),
        nullable=False
    )

    relationship_with_patient = Column(
        String(50),
        nullable=False
    )

    mobile_number = Column(
        String(20),
        nullable=False
    )

    email = Column(
        String(150),
        nullable=False
    )

    notification_preference = Column(
        String(30),
        nullable=False,
        default="Enabled"
    )

    patient = relationship(
        "Patient",
        back_populates="family_members"
    )

    __table_args__ = (
        Index(
            "ix_family_members_patient_id",
            "patient_id"
        ),
    )