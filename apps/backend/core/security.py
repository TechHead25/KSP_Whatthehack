# ============================================================
# NETRA AI — JWT Security Module
# Implements RS256 JWT per SECURITY.md §3.3
# Falls back to HS256 demo secret when keys not configured
# ============================================================
import base64
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from .config import get_settings

settings = get_settings()

# ── Password hashing ─────────────────────────────────────────

import bcrypt

def verify_password(plain: str, hashed: str) -> bool:
    # Some older hashes might use different format but for our DB they are standard bcrypt
    try:
        return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def hash_password(plain: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain.encode('utf-8'), salt).decode('utf-8')


# ── JWT helpers ──────────────────────────────────────────────

DEMO_SECRET = "netra-ai-demo-secret-change-in-production-use-rs256"
ALGORITHM_DEMO = "HS256"
ALGORITHM_PROD = "RS256"


def _get_signing_key() -> tuple[str, str]:
    """Return (key, algorithm) for token creation."""
    if settings.jwt_private_key_b64:
        key = base64.b64decode(settings.jwt_private_key_b64).decode()
        return key, ALGORITHM_PROD
    return DEMO_SECRET, ALGORITHM_DEMO


def _get_verify_key() -> tuple[str, str]:
    """Return (key, algorithm) for token verification."""
    if settings.jwt_public_key_b64:
        key = base64.b64decode(settings.jwt_public_key_b64).decode()
        return key, ALGORITHM_PROD
    return DEMO_SECRET, ALGORITHM_DEMO


def create_access_token(payload: dict[str, Any]) -> str:
    """Create a signed JWT access token with expiry."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.access_token_expire_minutes)
    data = {
        **payload,
        "iat": now,
        "exp": expire,
        "jti": str(uuid.uuid4()),
        "type": "access",
    }
    key, algo = _get_signing_key()
    return jwt.encode(data, key, algorithm=algo)


def create_refresh_token(officer_id: str) -> str:
    """Create a long-lived refresh token."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(hours=settings.refresh_token_expire_hours)
    data = {
        "sub": officer_id,
        "iat": now,
        "exp": expire,
        "jti": str(uuid.uuid4()),
        "type": "refresh",
    }
    key, algo = _get_signing_key()
    return jwt.encode(data, key, algorithm=algo)


def create_temp_token(officer_id: str) -> str:
    """Short-lived token for MFA challenge (5 minutes)."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=5)
    data = {
        "sub": officer_id,
        "iat": now,
        "exp": expire,
        "jti": str(uuid.uuid4()),
        "type": "mfa_pending",
    }
    key, algo = _get_signing_key()
    return jwt.encode(data, key, algorithm=algo)


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT. Raises JWTError on failure."""
    key, algo = _get_verify_key()
    return jwt.decode(token, key, algorithms=[algo])


def is_token_valid(token: str) -> bool:
    try:
        decode_token(token)
        return True
    except JWTError:
        return False
