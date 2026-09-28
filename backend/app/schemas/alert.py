from datetime import datetime

from pydantic import BaseModel


class AlertResponse(BaseModel):
    id: int
    patient_id: int
    location_id: int
    message: str
    status: str
    created_date: datetime

    class Config:
        from_attributes = True