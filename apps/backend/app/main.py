from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.core.config import settings
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # setup db tables on startup
    from app.db.session import engine, SessionLocal
    from app.models import Base, Area
    from sqlalchemy import text, select
    
    async with engine.begin() as conn:
        try:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
            await conn.run_sync(Base.metadata.create_all)
        except Exception as e:
            print(f"Database initialization error: {e}")

    # Seed initial items if empty for validation tests
    async with SessionLocal() as session:
        try:
            result = await session.execute(select(Area))
            if not result.scalars().first():
                from app.services.area_service import AreaService
                from app.schemas.area import AreaCreate
                service = AreaService(session)
                print("Seeding database with initial areas...")
                await service.create_area(AreaCreate(
                    name="Centro", 
                    geom_wkt="POLYGON((-43.1811 -22.9064, -43.1795 -22.9035, -43.1762 -22.9056, -43.1811 -22.9064))", 
                    description="Área central sujeita a alagamentos rápidos."
                ))
                await service.create_area(AreaCreate(
                    name="Barra", 
                    geom_wkt="POLYGON((-43.3524 -22.9997, -43.3424 -22.9997, -43.3424 -23.0031, -43.3524 -22.9997))", 
                    description="Zona costeira de alerta médica."
                ))
        except Exception as e:
            print(f"Seeding error: {e}")
            
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Urban Risk monitoring",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Urban Resilience API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(api_router, prefix=settings.API_V1_STR)
