from fastapi import APIRouter
from app.api.routes import areas

api_router = APIRouter()
api_router.include_router(areas.router, prefix="/areas", tags=["areas"])
