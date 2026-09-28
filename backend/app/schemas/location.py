from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class LocationCreate(BaseModel):
    location_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    address: str = Field(
        ...,
        min_length=5,
        max_length=255
    )

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

    geo_fence_radius: float = Field(
        ...,
        gt=0
    )


class LocationUpdate(BaseModel):
    location_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    address: Optional[str] = Field(
        default=None,
        min_length=5,
        max_length=255
    )

    latitude: Optional[float] = Field(
        default=None,
        ge=-90,
        le=90
    )

    longitude: Optional[float] = Field(
        default=None,
        ge=-180,
        le=180
    )

    geo_fence_radius: Optional[float] = Field(
        default=None,
        gt=0
    )


class LocationResponse(BaseModel):
    id: int
    patient_id: int
    location_name: str
    address: str
    latitude: float
    longitude: float
    geo_fence_radius: float
    is_active: bool
    created_date: datetime

    class Config:
        from_attributes = True