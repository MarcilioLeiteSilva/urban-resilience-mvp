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
        except Exception as e:
            print(f"PostGIS activation warning (maybe already loaded or permission issue): {e}")

        try:
            await conn.run_sync(Base.metadata.create_all)
            print("Database tables verified/created.")
        except Exception as e:
            print(f"Database tables creation error: {e}")

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
                    city="Rio de Janeiro",
                    description="Área central sujeita a alagamentos rápidos.",
                    geometry={
                        "type": "Polygon",
                        "coordinates": [[[-43.1811, -22.9064], [-43.1795, -22.9035], [-43.1762, -22.9056], [-43.1811, -22.9064]]]
                    }
                ))
                await service.create_area(AreaCreate(
                    name="Barra", 
                    city="Rio de Janeiro",
                    description="Zona costeira de alerta médica.",
                    geometry={
                        "type": "Polygon",
                        "coordinates": [[[-43.3524, -22.9997], [-43.3424, -22.9997], [-43.3424, -23.0031], [-43.3524, -22.9997]]]
                    }
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

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
