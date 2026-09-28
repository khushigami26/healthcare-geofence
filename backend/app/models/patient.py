from sqlalchemy import Column, Integer, String, Index
from sqlalchemy.orm import relationship

from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False
    )

    mobile_number = Column(
        String(20),
        nullable=False
    )

    status = Column(
        String(30),
        nullable=False,
        default="Active"
    )

    family_members = relationship(
        "FamilyMember",
        back_populates="patient",
        cascade="all, delete-orphan"
    )

    locations = relationship(
        "PatientLocation",
        back_populates="patient",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index(
            "ix_patients_mobile_number",
            "mobile_number"
        ),
    )