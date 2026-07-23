# ============================================================
# NETRA AI — FastAPI Dependencies (JWT + RBAC)
# Per CODING_STANDARDS.md §Python Standards
# ============================================================
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError

from core.exceptions import (
    InsufficientPermissionsException,
    TokenExpiredException,
)
from core.security import decode_token

bearer_scheme = HTTPBearer(auto_error=False)


class CurrentOfficer:
    """Parsed JWT claims for the current request."""
    def __init__(self, claims: dict):
        self.id: str = claims["sub"]
        self.badge: str = claims.get("badge", "")
        self.role: str = claims["role"]
        self.station_id: str = claims.get("station_id", "")
        self.district_id: str = claims.get("district_id", "")
        self.permissions: list[str] = claims.get("permissions", [])
        self.jurisdiction_scope: str = claims.get("jurisdiction_scope", "STATION")


async def get_current_officer(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> CurrentOfficer:
    """Extract and validate the JWT from the Authorization header."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")

    try:
        claims = decode_token(credentials.credentials)
    except JWTError:
        raise TokenExpiredException()

    if claims.get("type") not in (None, "access"):
        raise TokenExpiredException()

    return CurrentOfficer(claims)


def require_permission(permission: str):
    """Dependency factory — checks officer has a specific permission."""
    async def _check(officer: CurrentOfficer = Depends(get_current_officer)):
        if permission not in officer.permissions:
            raise InsufficientPermissionsException()
        return officer
    return _check


def require_role(*roles: str):
    """Dependency factory — checks officer has one of the required roles."""
    async def _check(officer: CurrentOfficer = Depends(get_current_officer)):
        if officer.role not in roles:
            raise InsufficientPermissionsException()
        return officer
    return _check
