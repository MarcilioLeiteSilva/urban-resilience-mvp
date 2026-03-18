from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.area import Area
from app.schemas.area import AreaCreate, AreaUpdate
from uuid import UUID
from geoalchemy2.functions import ST_GeomFromText
from typing import List, Optional

class AreaRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, id: UUID) -> Optional[Area]:
        result = await self.db.execute(select(Area).where(Area.id == id))
        return result.scalars().first()

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[Area]:
        result = await self.db.execute(select(Area).offset(offset).limit(limit))
        return list(result.scalars().all())

    async def create(self, obj_in: AreaCreate) -> Area:
        # Convert geom_wkt to PostGIS geometry via ST_GeomFromText
        db_obj = Area(
            name=obj_in.name,
            description=obj_in.description,
            risk_score=obj_in.risk_score,
            geom=ST_GeomFromText(obj_in.geom_wkt, srid=4326)
        )
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj
