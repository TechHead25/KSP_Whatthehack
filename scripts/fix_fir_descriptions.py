import asyncio
import os
import sys
import random

# Add apps/backend to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'backend')))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
from domain.shared.models import District, Station, Officer
from domain.suspects.models import Suspect
from domain.evidence.models import Evidence
from domain.fir.models import FIR

# ── Configuration ────────────────────────────────────────────────────────
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'netra_demo.db'))
DB_URL = f"sqlite+aiosqlite:///{DB_PATH}"

REALISTIC_DESCRIPTIONS = {
    "Vehicle Theft": [
        "Complainant reported theft of a two-wheeler vehicle parked outside residential quarters overnight. CCTV footage shows two suspects unlocking handle lock.",
        "Stolen commercial vehicle reported near highway junction. Vehicle was unlocked during loading operation.",
        "Unattended motorcycle stolen from shopping complex parking lot between 14:00 and 17:00 IST.",
        "Reported theft of luxury SUV parked near public park. Vehicle tracking device was forcibly disconnected."
    ],
    "Cybercrime": [
        "Victim duped of Rs 1,45,000 via fraudulent electricity bill update link. Funds transferred to multiple unverified digital wallets.",
        "Online banking fraud reported following phishing call posing as bank compliance officer requesting OTP.",
        "Cyber identity theft and extortion attempt using compromised social media profile.",
        "E-commerce seller fraud where fake payment confirmation screenshots were used to obtain electronic goods."
    ],
    "Assault": [
        "Physical altercation reported following a traffic dispute near major intersection. Victim sustained minor injuries.",
        "Group clash reported outside commercial establishment during late night hours. Patrol unit responded immediately.",
        "Assault reported following argument over property boundary line. Complainant referred to district hospital."
    ],
    "Burglary": [
        "Night break-in reported at locked commercial premises. Cash register broken and electronic equipment missing.",
        "Residential burglary reported while occupants were out of town. Front door lock picked and gold ornaments taken.",
        "Attempted burglary at jewelry showroom. Security alarm alerted patrolling Hoysala unit."
    ],
    "Fraud": [
        "Investment fraud involving unauthorized chit fund scheme promising double returns within six months.",
        "Real estate land sale fraud involving forged property ownership documents and fake NOC certificates.",
        "Job guarantee scam duping multiple candidates with forged government appointment letters."
    ],
    "Narcotics": [
        "Seizure of contraband narcotic substances during routine surprise vehicle inspection near city border checkpost.",
        "Interception of illicit substance delivery team near bus terminal following intelligence tip-off."
    ],
    "Extortion": [
        "Complainant received repeated extortion demands via internet telephony under threat of business disruption.",
        "Local business owner threatened by syndicate members demanding monthly protection money."
    ],
    "Kidnapping": [
        "Missing person report escalated to kidnapping investigation following ransom message received on mobile messenger.",
        "Attempted abduction reported near school premises. Local witnesses alerted nearby beat constable."
    ],
    "Homicide": [
        "Homicide investigation initiated following discovery of unidentified body near lake perimeter. Forensic team deployed."
    ],
    "Theft": [
        "Larceny reported from residential apartment complex. Valuables and laptop missing from ground floor apartment.",
        "Pickpocketing incident reported at crowded metro station concourse during peak commute hours."
    ]
}

async def fix_descriptions():
    print("Cleaning garbled FIR descriptions in netra_demo.db...")
    engine = create_async_engine(DB_URL, echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with async_session() as session:
        result = await session.execute(select(FIR))
        firs = result.scalars().all()
        print(f"Loaded {len(firs)} FIR records.")

        updated_count = 0
        for fir in firs:
            crime = fir.crime_type or "Theft"
            pool = REALISTIC_DESCRIPTIONS.get(crime, REALISTIC_DESCRIPTIONS["Theft"])
            new_desc = random.choice(pool)
            fir.description = new_desc
            updated_count += 1

        await session.commit()
        print(f"Successfully updated {updated_count} FIR descriptions to realistic English police text.")

    await engine.dispose()

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(fix_descriptions())
