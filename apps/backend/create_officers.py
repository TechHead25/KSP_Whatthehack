import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
import bcrypt

from backend.domain.shared.models import Officer, District, Station

def get_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

async def main():
    engine = create_async_engine("sqlite+aiosqlite:///./netra_demo.db")
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    
    async with async_session() as session:
        # Check if INSP-BLR-0001 exists
        badge = "INSP-BLR-0001"
        result = await session.execute(select(Officer).where(Officer.badge_number == badge))
        officer = result.scalars().first()
        
        if officer:
            officer.password_hash = get_hash("password123")
            officer.role = "INVESTIGATION_OFFICER"
            officer.mfa_enabled = False
            print("Officer updated")
        else:
            # get a station and district
            dist = (await session.execute(select(District).limit(1))).scalars().first()
            stat = (await session.execute(select(Station).limit(1))).scalars().first()
            
            officer = Officer(
                badge_number=badge,
                name="Inspector Rajesh Kumar",
                email="inspector.shivajinagar@ksp.gov.in",
                role="INVESTIGATION_OFFICER",
                rank="Inspector of Police",
                password_hash=get_hash("password123"),
                station_id=stat.id,
                district_id=dist.id,
                mfa_enabled=False
            )
            session.add(officer)
            print("Officer created")
            
        await session.commit()
    await engine.dispose()

if __name__ == "__main__":
    import sys
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
