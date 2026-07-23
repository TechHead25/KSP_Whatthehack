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
        # Check if admin already exists
        result = await session.execute(select(Officer).where(Officer.badge_number == "admin"))
        admin_user = result.scalars().first()
        
        if admin_user:
            admin_user.password_hash = get_hash("admin")
            admin_user.role = "SUPER_ADMIN"
            print("Admin updated")
        else:
            # get a station and district
            dist = (await session.execute(select(District).limit(1))).scalars().first()
            stat = (await session.execute(select(Station).limit(1))).scalars().first()
            
            admin_user = Officer(
                badge_number="admin",
                name="System Admin",
                email="admin@ksp.gov.in",
                role="SUPER_ADMIN",
                rank="SUPER_ADMIN",
                password_hash=get_hash("admin"),
                station_id=stat.id,
                district_id=dist.id,
                mfa_enabled=False
            )
            session.add(admin_user)
            print("Admin created")
            
        await session.commit()
    await engine.dispose()

if __name__ == "__main__":
    import sys
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
