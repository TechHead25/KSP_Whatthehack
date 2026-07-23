# ============================================================
# NETRA AI — Auth Domain Schemas (Pydantic v2)
# Mirrors API_SPEC.md §3 Authentication APIs
# ============================================================
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    badge_number: str = Field(..., min_length=5, max_length=30)
    password: str = Field(..., min_length=1, max_length=128)
    device_fingerprint: str | None = None


class MFAVerifyRequest(BaseModel):
    otp: str = Field(..., min_length=6, max_length=6)
    temp_token: str


class RefreshRequest(BaseModel):
    refresh_token: str


# ── Response schemas ─────────────────────────────────────────

class StationInfo(BaseModel):
    id: str
    name: str
    code: str


class DistrictInfo(BaseModel):
    id: str
    name: str
    code: str


class OfficerOut(BaseModel):
    id: str
    name: str
    badge_number: str
    email: str
    role: str
    rank: str
    permissions: list[str]
    jurisdiction_scope: str
    station: StationInfo
    district: DistrictInfo
    photo_url: str | None = None
    mfa_enabled: bool
    last_login: str | None = None


class TokensOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int  # seconds


class LoginResponse(BaseModel):
    tokens: TokensOut | None = None
    officer: OfficerOut | None = None
    mfa_required: bool = False
    temp_token: str | None = None


class MessageResponse(BaseModel):
    message: str
