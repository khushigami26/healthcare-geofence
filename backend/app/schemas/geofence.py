from datetime import datetime

from pydantic import BaseModel, Field


class GeofenceCheckRequest(BaseModel):
    latitude: float = Field(
        ...,
        ge=-90,
        le=90
    )

    longitude: float = Field(
        ...,
        ge=-180,
        le=180
    )


class GeofenceCheckResponse(BaseModel):
    patient_id: int
    location_id: int
    location_name: str

    latitude: float
    longitude: float

    distance: float
    radius: float

    status: str
    checked_at: datetime