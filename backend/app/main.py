from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models

from app.routes.patients import router as patient_router
from app.routes.family_members import router as family_member_router
from app.routes.locations import router as location_router
from app.routes.geofence import router as geofence_router
from app.routes.alerts import router as alert_router


app = FastAPI(
    title="Healthcare Geo-Fence API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(patient_router)
app.include_router(family_member_router)
app.include_router(location_router)
app.include_router(geofence_router)
app.include_router(alert_router)


@app.get("/")
def home():
    return {
        "message": "Healthcare Geo-Fence API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }