from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from ....infrastructure.database.catalyst import get_db
from ....infrastructure.database.neo4j import neo4j_manager
from ....infrastructure.cache.redis import redis_cache
from ....core.responses import SuccessResponse

router = APIRouter(prefix="/health", tags=["Monitoring & Health Checks"])

@router.get("/live", response_model=SuccessResponse[str])
async def liveness_probe():
    """Simple K8s liveness probe."""
    return SuccessResponse(data="OK")

@router.get("/ready", response_model=SuccessResponse[dict])
async def readiness_probe(db: AsyncSession = Depends(get_db)):
    """Deep readiness probe checking all data stores."""
    status = {"postgres": False, "neo4j": False, "redis": False}
    
    # Check Postgres
    try:
        await db.execute(text("SELECT 1"))
        status["postgres"] = True
    except:
        pass
        
    # Check Neo4j
    try:
        if await neo4j_manager.verify_connectivity():
            status["neo4j"] = True
    except:
        pass
        
    # Check Redis
    try:
        if await redis_cache.ping():
            status["redis"] = True
    except:
        pass

    return SuccessResponse(data=status)
