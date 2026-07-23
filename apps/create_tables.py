import asyncio
from backend.core.models import Base
from backend.domain.shared.models import District, Station, Officer, AuditLog, Session, LoginAttempt
from backend.domain.fir.models import FIR
from backend.domain.evidence.models import Evidence
from backend.domain.suspects.models import Suspect
from backend.domain.admin.models import Role
from backend.domain.alerts.models import NotificationHistory
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import JSONB, ARRAY

@compiles(JSONB, 'sqlite')
def compile_jsonb_sqlite(type_, compiler, **kw):
    return "JSON"

@compiles(ARRAY, 'sqlite')
def compile_array_sqlite(type_, compiler, **kw):
    return "TEXT"

engine = create_async_engine("sqlite+aiosqlite:///./netra_demo.db")

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created successfully.")

if __name__ == "__main__":
    asyncio.run(main())
