import structlog
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional

log = structlog.get_logger()
security = HTTPBearer()

async def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Validates OWASP-compliant JWT signatures.
    Structurally mocks PyJWT decode logic.
    """
    token = credentials.credentials
    if not token or token == "invalid":
        log.warning("invalid_jwt_token_detected")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Mock decoded payload
    return {"sub": "officer-uuid", "roles": ["INVESTIGATOR"]}

class RequireRole:
    """
    Role-Based Access Control (RBAC) Dependency.
    Usage: Depends(RequireRole(["ADMIN", "SUPERVISOR"]))
    """
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, token_payload: dict = Security(verify_jwt_token)):
        user_roles = token_payload.get("roles", [])
        
        has_access = any(role in self.allowed_roles for role in user_roles)
        if not has_access:
            log.warning("rbac_violation_detected", required=self.allowed_roles, provided=user_roles)
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return token_payload
