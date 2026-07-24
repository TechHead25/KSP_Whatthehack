# ============================================================
# NETRA AI — Auth Service
# Business logic for authentication, MFA, session management
# Implements SECURITY.md §3 Authentication Architecture
# ============================================================
import time
from datetime import datetime, timezone, timedelta
from collections import defaultdict
from typing import Any

import pyotp

from core.config import get_settings
from core.exceptions import (
    AccountLockedException,
    InvalidCredentialsException,
    MFAInvalidException,
    OfficerNotFoundException,
    TokenExpiredException,
)
from core.security import (
    create_access_token,
    create_refresh_token,
    create_temp_token,
    decode_token,
    verify_password,
)
from .schemas import LoginResponse, OfficerOut, StationInfo, DistrictInfo, TokensOut

settings = get_settings()

# ── Demo officer seed data ───────────────────────────────────
# Used when demo_mode=True — no DB required for Datathon demo

DEMO_OFFICERS: dict[str, dict[str, Any]] = {
    "COMM-KA-0001": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "badge_number": "COMM-KA-0001",
        "name": "Commissioner Venkatesh Rao",
        "email": "commissioner@ksp.gov.in",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewi.SnfxthHXiSmW",  # Demo@2026!
        "role": "COMMISSIONER",
        "rank": "Commissioner of Police",
        "mfa_enabled": True,
        "mfa_secret": "JBSWY3DPEHPK3PXP",
        "station": {"id": "st-001", "name": "KSP Headquarters", "code": "KSP-HQ"},
        "district": {"id": "dist-001", "name": "Karnataka State", "code": "KA"},
        "jurisdiction_scope": "NATIONAL",
    },
    "DYSP-BLR-0001": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "badge_number": "DYSP-BLR-0001",
        "name": "DySP Priya Nair",
        "email": "dysp.blr@ksp.gov.in",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewi.SnfxthHXiSmW",
        "role": "DYSP",
        "rank": "Deputy Superintendent of Police",
        "mfa_enabled": True,
        "mfa_secret": "JBSWY3DPEHPK3PXP",
        "station": {"id": "st-002", "name": "Bengaluru Urban District HQ", "code": "BLR-DIST-HQ"},
        "district": {"id": "dist-002", "name": "Bengaluru Urban", "code": "BLR-U"},
        "jurisdiction_scope": "DISTRICT",
    },
    "INSP-BLR-0001": {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "badge_number": "INSP-BLR-0001",
        "name": "Inspector Rajesh Kumar",
        "email": "inspector.shivajinagar@ksp.gov.in",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewi.SnfxthHXiSmW",
        "role": "INSPECTOR",
        "rank": "Inspector of Police",
        "mfa_enabled": True,
        "mfa_secret": "JBSWY3DPEHPK3PXP",
        "station": {"id": "st-003", "name": "Shivajinagar Police Station", "code": "BLR-SHJ"},
        "district": {"id": "dist-002", "name": "Bengaluru Urban", "code": "BLR-U"},
        "jurisdiction_scope": "STATION",
    },
    "ANAL-KA-0001": {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "badge_number": "ANAL-KA-0001",
        "name": "Analyst Kavitha Reddy",
        "email": "analyst@ksp.gov.in",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewi.SnfxthHXiSmW",
        "role": "ANALYST",
        "rank": "Crime Analyst",
        "mfa_enabled": False,
        "mfa_secret": None,
        "station": {"id": "st-001", "name": "KSP Headquarters", "code": "KSP-HQ"},
        "district": {"id": "dist-001", "name": "Karnataka State", "code": "KA"},
        "jurisdiction_scope": "NATIONAL",
    },
    "PROS-KA-0001": {
        "id": "550e8400-e29b-41d4-a716-446655440005",
        "badge_number": "PROS-KA-0001",
        "name": "Advocate Suresh Babu",
        "email": "prosecutor@ksp.gov.in",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewi.SnfxthHXiSmW",
        "role": "PROSECUTOR",
        "rank": "Public Prosecutor",
        "mfa_enabled": False,
        "mfa_secret": None,
        "station": {"id": "st-001", "name": "KSP Headquarters", "code": "KSP-HQ"},
        "district": {"id": "dist-001", "name": "Karnataka State", "code": "KA"},
        "jurisdiction_scope": "NATIONAL",
    },
}

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from domain.shared.models import Officer, Station, District, LoginAttempt, Session

# Role → permissions mapping (mirrors packages/config/roles.config.ts)
ROLE_PERMISSIONS: dict[str, list[str]] = {
    "SUPER_ADMIN": [
        "READ_ALL_FIRS", "READ_DISTRICT_FIRS", "READ_STATION_FIRS", "WRITE_FIRS",
        "READ_ALL_SUSPECTS", "READ_DISTRICT_SUSPECTS", "READ_STATION_SUSPECTS", "WRITE_SUSPECTS",
        "VIEW_CRIMINAL_NETWORK", "VIEW_HEATMAP", "VIEW_ANALYTICS", "GENERATE_REPORTS",
        "USE_AI_ASSISTANT", "MANAGE_OFFICERS", "VIEW_AUDIT_LOGS", "MANAGE_ALERTS",
        "VIEW_EVIDENCE", "MANAGE_PATROL",
    ],
    "STATE_ADMIN": [
        "READ_ALL_FIRS", "READ_DISTRICT_FIRS", "READ_STATION_FIRS",
        "READ_ALL_SUSPECTS", "READ_DISTRICT_SUSPECTS", "READ_STATION_SUSPECTS",
        "VIEW_CRIMINAL_NETWORK", "VIEW_HEATMAP", "VIEW_ANALYTICS", "GENERATE_REPORTS",
        "USE_AI_ASSISTANT", "VIEW_AUDIT_LOGS", "MANAGE_ALERTS", "VIEW_EVIDENCE", "MANAGE_PATROL",
    ],
    "DISTRICT_ADMIN": [
        "READ_DISTRICT_FIRS", "READ_STATION_FIRS", "WRITE_FIRS",
        "READ_DISTRICT_SUSPECTS", "READ_STATION_SUSPECTS", "WRITE_SUSPECTS",
        "VIEW_CRIMINAL_NETWORK", "VIEW_HEATMAP", "VIEW_ANALYTICS", "GENERATE_REPORTS",
        "USE_AI_ASSISTANT", "VIEW_AUDIT_LOGS", "MANAGE_ALERTS", "VIEW_EVIDENCE", "MANAGE_PATROL",
    ],
    "INVESTIGATION_OFFICER": [
        "READ_STATION_FIRS", "WRITE_FIRS",
        "READ_STATION_SUSPECTS", "WRITE_SUSPECTS",
        "VIEW_CRIMINAL_NETWORK", "VIEW_HEATMAP", "VIEW_ANALYTICS", "GENERATE_REPORTS",
        "USE_AI_ASSISTANT", "MANAGE_ALERTS", "VIEW_EVIDENCE", "MANAGE_PATROL",
    ],
    "POLICE_OFFICER": ["READ_STATION_FIRS", "READ_STATION_SUSPECTS", "VIEW_HEATMAP", "MANAGE_ALERTS"],
    "READ_ONLY_OFFICER": [
        "READ_STATION_FIRS", "READ_DISTRICT_FIRS", "READ_ALL_FIRS",
        "READ_STATION_SUSPECTS", "VIEW_CRIMINAL_NETWORK",
        "GENERATE_REPORTS", "USE_AI_ASSISTANT", "VIEW_EVIDENCE",
    ],
    "AUDITOR": [
        "READ_STATION_FIRS", "READ_DISTRICT_FIRS", "READ_ALL_FIRS",
        "READ_STATION_SUSPECTS", "READ_DISTRICT_SUSPECTS", "READ_ALL_SUSPECTS",
        "VIEW_CRIMINAL_NETWORK", "VIEW_HEATMAP", "VIEW_ANALYTICS",
        "USE_AI_ASSISTANT", "GENERATE_REPORTS",
    ],
}

MAX_ATTEMPTS = 5
LOCKOUT_SECONDS = 15 * 60  # 15 minutes


class AuthService:
    """Handles login, MFA, token refresh, and logout using PostgreSQL."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def _check_lockout(self, badge_number: str) -> None:
        now_str = datetime.now(timezone.utc).isoformat()
        lockout_time = (datetime.now(timezone.utc) - timedelta(seconds=LOCKOUT_SECONDS)).isoformat()
        
        result = await self.db.execute(
            select(func.count(LoginAttempt.id)).where(
                LoginAttempt.badge_number == badge_number,
                LoginAttempt.success == False,
                LoginAttempt.attempt_time > lockout_time
            )
        )
        count = result.scalar_one()
        if count >= MAX_ATTEMPTS:
            raise AccountLockedException()

    async def _record_failed_attempt(self, badge_number: str) -> None:
        attempt = LoginAttempt(
            badge_number=badge_number,
            success=False,
            attempt_time=datetime.now(timezone.utc).isoformat()
        )
        self.db.add(attempt)
        await self.db.commit()

    async def _clear_attempts(self, badge_number: str) -> None:
        # DB version: we could delete them, or just log a successful attempt
        attempt = LoginAttempt(
            badge_number=badge_number,
            success=True,
            attempt_time=datetime.now(timezone.utc).isoformat()
        )
        self.db.add(attempt)
        await self.db.commit()

    async def _get_officer(self, badge_number: str) -> Officer:
        from sqlalchemy.orm import selectinload
        from sqlalchemy import func
        result = await self.db.execute(
            select(Officer)
            .options(selectinload(Officer.station), selectinload(Officer.district))
            .where(func.lower(Officer.badge_number) == badge_number.lower())
        )
        officer = result.scalars().first()
        if not officer:
            raise OfficerNotFoundException()
        return officer
        
    async def _get_officer_by_id(self, officer_id: str) -> Officer:
        from sqlalchemy.orm import selectinload
        result = await self.db.execute(
            select(Officer)
            .options(selectinload(Officer.station), selectinload(Officer.district))
            .where(Officer.id == officer_id)
        )
        officer = result.scalars().first()
        if not officer:
            raise OfficerNotFoundException()
        return officer

    def _build_officer_out(self, officer: Officer) -> OfficerOut:
        return OfficerOut(
            id=str(officer.id),
            name=officer.name,
            badge_number=officer.badge_number,
            email=officer.email,
            role=officer.role,
            rank=officer.rank,
            permissions=ROLE_PERMISSIONS.get(officer.role, []),
            jurisdiction_scope="NATIONAL" if officer.role in ["SUPER_ADMIN", "STATE_ADMIN", "AUDITOR", "READ_ONLY_OFFICER"] else ("DISTRICT" if officer.role == "DISTRICT_ADMIN" else "STATION"),
            station=StationInfo(id=str(officer.station.id), name=officer.station.name, code=officer.station.code) if officer.station else None,
            district=DistrictInfo(id=str(officer.district.id), name=officer.district.name, code=officer.district.code) if officer.district else None,
            mfa_enabled=officer.mfa_enabled,
        )

    def _build_jwt_claims(self, officer: Officer) -> dict[str, Any]:
        return {
            "sub": str(officer.id),
            "badge": officer.badge_number,
            "role": officer.role,
            "station_id": str(officer.station_id) if officer.station_id else "",
            "district_id": str(officer.district_id) if officer.district_id else "",
            "permissions": ROLE_PERMISSIONS.get(officer.role, []),
            "jurisdiction_scope": "NATIONAL" if officer.role in ["SUPER_ADMIN", "STATE_ADMIN", "AUDITOR", "READ_ONLY_OFFICER"] else ("DISTRICT" if officer.role == "DISTRICT_ADMIN" else "STATION"),
        }

    async def login(self, badge_number: str, password: str) -> LoginResponse:
        await self._check_lockout(badge_number)

        try:
            officer = await self._get_officer(badge_number)
        except OfficerNotFoundException:
            await self._record_failed_attempt(badge_number)
            raise InvalidCredentialsException()

        if not officer.password_hash or not verify_password(password, officer.password_hash):
            await self._record_failed_attempt(badge_number)
            raise InvalidCredentialsException()

        await self._clear_attempts(badge_number)

        # MFA required for certain roles
        mfa_required = officer.mfa_enabled and officer.role in [
            "SUPER_ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN", "INVESTIGATION_OFFICER"
        ]

        if mfa_required:
            temp_token = create_temp_token(str(officer.id))
            return LoginResponse(
                mfa_required=True,
                temp_token=temp_token,
            )

        claims = self._build_jwt_claims(officer)
        access_token = create_access_token(claims)
        refresh_token = create_refresh_token(str(officer.id))

        # Store session
        db_session = Session(
            officer_id=officer.id,
            token=refresh_token,
            expires_at=(datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
        )
        self.db.add(db_session)
        await self.db.commit()

        return LoginResponse(
            mfa_required=False,
            tokens=TokensOut(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="Bearer",
                expires_in=settings.access_token_expire_minutes * 60,
            ),
            officer=self._build_officer_out(officer),
        )

    async def verify_mfa(self, otp: str, temp_token: str) -> LoginResponse:
        try:
            claims = decode_token(temp_token)
        except Exception:
            raise TokenExpiredException()

        if claims.get("type") != "mfa_pending":
            raise MFAInvalidException()

        officer_id = claims["sub"]
        officer = await self._get_officer_by_id(officer_id)

        # Verify TOTP
        if officer.mfa_secret:
            totp = pyotp.TOTP(officer.mfa_secret)
            if not totp.verify(otp, valid_window=1):
                raise MFAInvalidException()
        else:
            # Demo: accept "123456" when no secret configured
            if otp != "123456":
                raise MFAInvalidException()

        token_claims = self._build_jwt_claims(officer)
        access_token = create_access_token(token_claims)
        new_refresh_token = create_refresh_token(str(officer.id))

        # Store session
        db_session = Session(
            officer_id=officer.id,
            token=new_refresh_token,
            expires_at=(datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
        )
        self.db.add(db_session)
        await self.db.commit()

        return LoginResponse(
            mfa_required=False,
            tokens=TokensOut(
                access_token=access_token,
                refresh_token=new_refresh_token,
                token_type="Bearer",
                expires_in=settings.access_token_expire_minutes * 60,
            ),
            officer=self._build_officer_out(officer),
        )

    async def refresh_token(self, refresh_token: str) -> TokensOut:
        try:
            claims = decode_token(refresh_token)
        except Exception:
            raise TokenExpiredException()

        if claims.get("type") != "refresh":
            raise TokenExpiredException()

        # Validate session in DB
        result = await self.db.execute(
            select(Session).where(Session.token == refresh_token, Session.is_active == True)
        )
        db_session = result.scalars().first()
        if not db_session:
            raise TokenExpiredException()

        officer_id = claims["sub"]
        officer = await self._get_officer_by_id(officer_id)

        token_claims = self._build_jwt_claims(officer)
        access_token = create_access_token(token_claims)
        new_refresh_token = create_refresh_token(str(officer.id))

        # Rotate session
        db_session.is_active = False
        new_session = Session(
            officer_id=officer.id,
            token=new_refresh_token,
            expires_at=(datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
        )
        self.db.add(new_session)
        await self.db.commit()

        return TokensOut(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="Bearer",
            expires_in=settings.access_token_expire_minutes * 60,
        )

    async def logout(self, refresh_token: str) -> None:
        if not refresh_token:
            return
        result = await self.db.execute(
            select(Session).where(Session.token == refresh_token)
        )
        db_session = result.scalars().first()
        if db_session:
            db_session.is_active = False
            await self.db.commit()
