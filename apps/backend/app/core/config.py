from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Urban Resilience API"
    API_V1_STR: str = "/api/v1"
    
    # Optional direct Database string or URL provided by Easypanel
    DATABASE_URL: Optional[str] = None
    
    # Fallback/Default config
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "urban_resilience"
    POSTGRES_PORT: str = "5432"
    
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        if self.DATABASE_URL:
            # Replace database scheme for asyncpg driver
            url = self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
            url = url.replace("postgres://", "postgresql+asyncpg://")
            return url
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    model_config = ConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
