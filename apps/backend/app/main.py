from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Urban Risk monitoring",
    version="0.1.0",
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production config/core
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

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)
