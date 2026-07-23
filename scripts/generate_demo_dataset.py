import asyncio
import os
import sys
import random
import uuid
from datetime import datetime, timedelta

# Add apps/backend to Python path so we can import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'backend')))

from faker import Faker
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from core.models import Base
from domain.shared.models import District, Station, Officer, Suspect
from domain.fir.models import FIR, FIRSuspect
from domain.admin.models import Role

# ── Configuration ────────────────────────────────────────────────────────
DB_URL = "sqlite+aiosqlite:///../apps/backend/netra_demo.db"

# ── Data Counts ──────────────────────────────────────────────────────────
NUM_FIRS = 500
NUM_CRIMINALS = 150
NUM_VICTIMS = 300
NUM_VEHICLES = 200
NUM_PHONES = 500
NUM_LOCATIONS = 200
NUM_NETWORKS = 100
NUM_HOTSPOTS = 50
NUM_OFFICERS = 25

# ── Setup Faker (Indian Locale) ──────────────────────────────────────────
fake = Faker('en_IN')

# Bangalore/Karnataka specifics
STATIONS = [
    "Cubbon Park PS", "Koramangala PS", "Indiranagar PS", "Whitefield PS", 
    "Jayanagar PS", "Malleswaram PS", "Electronic City PS", "HSR Layout PS",
    "Basavanagudi PS", "Shivajinagar PS"
]

DISTRICTS = [
    ("Bengaluru Central", "BLR-C"),
    ("Bengaluru South", "BLR-S"),
    ("Bengaluru East", "BLR-E"),
    ("Bengaluru West", "BLR-W"),
    ("Bengaluru North", "BLR-N"),
]

CRIME_TYPES = [
    "Theft", "Assault", "Burglary", "Cybercrime", "Vehicle Theft", 
    "Narcotics", "Fraud", "Extortion", "Kidnapping", "Homicide"
]

def generate_ka_vehicle_plate():
    rto = random.randint(1, 55)
    chars = "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=2))
    nums = f"{random.randint(1, 9999):04d}"
    return f"KA-{rto:02d}-{chars}-{nums}"

async def seed_data():
    print("🚀 Initializing NETRA AI Demo Dataset Generation...")
    engine = create_async_engine(DB_URL, echo=False)
    
    # Create tables
    async with engine.begin() as conn:
        print("📦 Creating database schemas...")
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async_session = async_sessionmaker(engine, expire_on_commit=False)
    
    async with async_session() as session:
        print("👮 Generating Districts and Stations...")
        districts_db = []
        for name, code in DISTRICTS:
            d = District(name=name, code=code, region="Bengaluru", population=random.randint(500000, 2000000))
            session.add(d)
            districts_db.append(d)
        await session.commit()

        stations_db = []
        for i, s_name in enumerate(STATIONS):
            s = Station(
                name=s_name,
                code=f"PS-{i+1:03d}",
                district_id=random.choice(districts_db).id,
                status="OPEN",
                latitude=fake.latitude(),
                longitude=fake.longitude()
            )
            session.add(s)
            stations_db.append(s)
        await session.commit()

        print("🕵️ Generating Officers (User Accounts)...")
        roles = ["Inspector", "Sub-Inspector", "Constable", "DySP"]
        officers_db = []
        
        # Add demo accounts
        demo_accounts = [
            ("COMM-KA-0001", "Commissioner Demo", "comm@ksp.gov.in", "Commissioner"),
            ("DYSP-BLR-0001", "DySP Demo", "dysp@ksp.gov.in", "DySP"),
            ("INSP-BLR-0001", "Inspector Demo", "insp@ksp.gov.in", "Inspector"),
            ("ANAL-KA-0001", "Analyst Demo", "analyst@ksp.gov.in", "Analyst"),
            ("PROS-KA-0001", "Prosecutor Demo", "pros@ksp.gov.in", "Prosecutor")
        ]
        
        for badge, name, email, rank in demo_accounts:
            o = Officer(
                badge_number=badge, name=name, email=email,
                role=rank.upper(), rank=rank,
                station_id=random.choice(stations_db).id,
                district_id=random.choice(districts_db).id
            )
            session.add(o)
            officers_db.append(o)
            
        for _ in range(NUM_OFFICERS):
            rank = random.choice(roles)
            o = Officer(
                badge_number=f"KA-{random.randint(1000, 9999)}",
                name=fake.name(),
                email=fake.unique.email(),
                role=rank.upper(),
                rank=rank,
                station_id=random.choice(stations_db).id,
                district_id=random.choice(districts_db).id
            )
            session.add(o)
            officers_db.append(o)
        await session.commit()

        print(f"🦹 Generating {NUM_CRIMINALS} Suspects/Criminals...")
        suspects_db = []
        for _ in range(NUM_CRIMINALS):
            s = Suspect(
                name=fake.name(),
                aliases=[fake.first_name() for _ in range(random.randint(0, 2))],
                dob=str(fake.date_of_birth(minimum_age=18, maximum_age=65)),
                gender=random.choice(["Male", "Female"]),
                national_id=f"{random.randint(1000, 9999)} {random.randint(1000, 9999)} {random.randint(1000, 9999)}",
                phone=[fake.phone_number() for _ in range(random.randint(1, 3))],
                address_current=fake.address(),
                risk_score=random.uniform(10.0, 99.0),
                risk_level=random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
                is_wanted=random.random() > 0.8,
                is_incarcerated=random.random() > 0.9,
                gang_affiliation=f"Gang-{random.randint(1, 20)}" if random.random() > 0.7 else None
            )
            session.add(s)
            suspects_db.append(s)
        await session.commit()

        print(f"📄 Generating {NUM_FIRS} FIRs...")
        firs_db = []
        start_date = datetime.now() - timedelta(days=365)
        for i in range(NUM_FIRS):
            incident_date = start_date + timedelta(days=random.randint(0, 365), hours=random.randint(0, 23))
            f = FIR(
                fir_number=f"FIR/{incident_date.year}/{random.randint(100, 9999):04d}",
                station_id=random.choice(stations_db).id,
                district_id=random.choice(districts_db).id,
                date_filed=incident_date + timedelta(hours=random.randint(1, 48)),
                date_incident=incident_date,
                crime_type=random.choice(CRIME_TYPES),
                status=random.choice(["OPEN", "INVESTIGATING", "CLOSED", "CHARGE_SHEETED"]),
                priority=random.choice(["LOW", "NORMAL", "HIGH", "CRITICAL"]),
                description=fake.paragraph(nb_sentences=3),
                location_text=fake.street_address(),
                latitude=fake.latitude(),
                longitude=fake.longitude(),
                reporting_officer_id=random.choice(officers_db).id,
                investigating_officer_id=random.choice(officers_db).id,
                risk_score=random.uniform(10.0, 99.0)
            )
            session.add(f)
            firs_db.append(f)
        await session.commit()
        
        print("🔗 Linking Suspects to FIRs...")
        for fir in firs_db:
            if random.random() > 0.3: # 70% of FIRs have known suspects
                num_suspects = random.randint(1, 3)
                chosen = random.sample(suspects_db, num_suspects)
                for sus in chosen:
                    fs = FIRSuspect(
                        fir_id=fir.id,
                        suspect_id=sus.id,
                        role=random.choice(["ACCUSED", "MASTERMIND", "ACCOMPLICE"])
                    )
                    session.add(fs)
        await session.commit()

        print("✅ Database seeding complete.")
        
    await engine.dispose()

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(seed_data())
