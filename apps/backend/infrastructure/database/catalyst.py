# ============================================================
# NETRA AI — Catalyst PostgreSQL Connection Manager
# Async SQLAlchemy engine and session management
# ============================================================
from typing import AsyncGenerator
import structlog
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from ...core.config import get_settings

settings = get_settings()
log = structlog.get_logger()

# Async engine for Postgres (or fallback SQLite for demo)
engine_kwargs = {
    "echo": settings.debug,
    "future": True,
}
if "sqlite" not in settings.database_url:
    engine_kwargs["pool_size"] = 20
    engine_kwargs["max_overflow"] = 10
    engine_kwargs["pool_pre_ping"] = True

engine = create_async_engine(
    settings.database_url,
    **engine_kwargs
)

async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for FastAPI to get a database session."""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            log.error("db_session_rollback", error=str(e))
            raise
        finally:
            await session.close()
