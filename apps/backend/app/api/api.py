from app.api.routes import areas, reports, incidents

api_router = APIRouter()
api_router.include_router(areas.router, prefix="/areas", tags=["areas"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
