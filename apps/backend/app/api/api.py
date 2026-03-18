from app.api.routes import areas, reports, incidents, interventions, dashboard

api_router = APIRouter()
api_router.include_router(areas.router, prefix="/areas", tags=["areas"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(interventions.router, prefix="/interventions", tags=["interventions"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
