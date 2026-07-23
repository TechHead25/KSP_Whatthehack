import asyncio
import os
import sys
import random
import uuid
from datetime import datetime, timedelta

from faker import Faker
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import JSONB, ARRAY

@compiles(JSONB, 'sqlite')
def compile_jsonb_sqlite(type_, compiler, **kw):
    return "JSON"

@compiles(ARRAY, 'sqlite')
def compile_array_sqlite(type_, compiler, **kw):
    return "JSON"

from backend.core.models import Base
from backend.domain.shared.models import District, Station, Officer
from backend.domain.suspects.models import Suspect
from backend.domain.fir.models import FIR, FIRSuspect
from backend.domain.admin.models import Role
try:
    from backend.domain.evidence.models import Evidence
except ImportError:
    pass

import sqlite3
import json
sqlite3.register_adapter(list, lambda l: json.dumps(l))
sqlite3.register_adapter(dict, lambda d: json.dumps(d))

# ── Configuration ────────────────────────────────────────────────────────
DB_URL = "sqlite+aiosqlite:///./netra_demo.db"

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
    "THEFT", "ASSAULT", "MURDER", "CYBER", "FRAUD", "NARCOTICS", "OTHER"
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
        roles = ["POLICE_OFFICER", "INVESTIGATION_OFFICER", "READ_ONLY_OFFICER", "DISTRICT_ADMIN", "STATE_ADMIN"]
        officers_db = []
        
        # Add demo accounts
        # Default password for demo accounts is Demo@2026!
        demo_password_hash = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewi.SnfxthHXiSmW"
        
        demo_accounts = [
            ("COMM-KA-0001", "Commissioner Demo", "comm@ksp.gov.in", "SUPER_ADMIN"),
            ("DYSP-BLR-0001", "DySP Demo", "dysp@ksp.gov.in", "DISTRICT_ADMIN"),
            ("INSP-BLR-0001", "Inspector Demo", "insp@ksp.gov.in", "INVESTIGATION_OFFICER"),
            ("ANAL-KA-0001", "Analyst Demo", "analyst@ksp.gov.in", "AUDITOR"),
            ("PROS-KA-0001", "Prosecutor Demo", "pros@ksp.gov.in", "READ_ONLY_OFFICER")
        ]
        
        for badge, name, email, rank in demo_accounts:
            o = Officer(
                badge_number=badge, name=name, email=email,
                role=rank.upper(), rank=rank,
                password_hash=demo_password_hash,
                station_id=random.choice(stations_db).id,
                district_id=random.choice(districts_db).id,
                mfa_enabled=False
            )
            session.add(o)
            officers_db.append(o)
            
        for i in range(NUM_OFFICERS):
            rank = random.choice(roles)
            o = Officer(
                badge_number=f"KA-{1000+i:04d}",
                name=fake.name(),
                email=fake.unique.email(),
                role=rank.upper(),
                rank=rank,
                password_hash=demo_password_hash,
                station_id=random.choice(stations_db).id,
                district_id=random.choice(districts_db).id,
                mfa_enabled=False
            )
            session.add(o)
            officers_db.append(o)
        await session.commit()

        print(f"🦹 Generating {NUM_CRIMINALS} Suspects/Criminals...")
        suspects_db = []
        for _ in range(NUM_CRIMINALS):
            s = Suspect(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                gender=random.choice(["Male", "Female"]),
                date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=65),
                aadhar_number=f"{random.randint(1000, 9999)} {random.randint(1000, 9999)} {random.randint(1000, 9999)}",
                pan_number=f"{fake.random_uppercase_letter() * 5}{random.randint(1000, 9999)}{fake.random_uppercase_letter()}",
                heat_score=random.uniform(10.0, 99.0),
                risk_score=random.uniform(10.0, 99.0),
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
                fir_number=f"FIR/{incident_date.year}/{(i+1):04d}",
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
