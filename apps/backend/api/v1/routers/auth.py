# ============================================================
# NETRA AI — FastAPI Auth Router
# Implements API_SPEC.md §3 Authentication APIs
# ============================================================
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse

from ....core.exceptions import NETRABaseException
from ....core.security import decode_token
from ....domain.auth.schemas import (
    LoginRequest,
    LoginResponse,
    MFAVerifyRequest,
    MessageResponse,
    RefreshRequest,
    TokensOut,
)
from ....domain.auth.service import AuthService

from sqlalchemy.ext.asyncio import AsyncSession
from ....infrastructure.database.catalyst import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(db)


def _success(data: dict, status_code: int = 200) -> JSONResponse:
    from datetime import datetime, timezone
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "data": data,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@router.post("/login", response_model=None, summary="Officer Login")
async def login(
    body: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    """
    Authenticate an officer with badge number and password.
    Returns JWT tokens or MFA challenge per SECURITY.md §3.2
    """
    result = await service.login(body.badge_number, body.password)

    if result.mfa_required:
        return _success({
            "mfa_required": True,
            "temp_token": result.temp_token,
        })

    # Set refresh token as httpOnly cookie (XSS protection per SECURITY.md §3.3)
    response.set_cookie(
        key="refresh_token",
        value=result.tokens.refresh_token if result.tokens else "",
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=24 * 60 * 60,
    )

    return _success({
        "mfa_required": False,
        "access_token": result.tokens.access_token if result.tokens else "",
        "token_type": "Bearer",
        "expires_in": result.tokens.expires_in if result.tokens else 3600,
        "officer": result.officer.model_dump() if result.officer else None,
    })


@router.post("/mfa/verify", summary="Verify MFA OTP")
async def verify_mfa(
    body: MFAVerifyRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    """Verify TOTP code after login challenge."""
    result = await service.verify_mfa(body.otp, body.temp_token)

    response.set_cookie(
        key="refresh_token",
        value=result.tokens.refresh_token if result.tokens else "",
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=24 * 60 * 60,
    )

    return _success({
        "access_token": result.tokens.access_token if result.tokens else "",
        "token_type": "Bearer",
        "expires_in": result.tokens.expires_in if result.tokens else 3600,
        "officer": result.officer.model_dump() if result.officer else None,
    })


@router.post("/refresh", summary="Refresh Access Token")
async def refresh_token(
    request: Request,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    """Refresh access token using the httpOnly refresh token cookie."""
    refresh = request.cookies.get("refresh_token")
    if not refresh:
        raise HTTPException(status_code=401, detail="No refresh token")

    tokens = await service.refresh_token(refresh)

    response.set_cookie(
        key="refresh_token",
        value=tokens.refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=24 * 60 * 60,
    )

    return _success({
        "access_token": tokens.access_token,
        "token_type": "Bearer",
        "expires_in": tokens.expires_in,
    })


@router.post("/logout", summary="Officer Logout")
async def logout(
    request: Request,
    response: Response,
    service: AuthService = Depends(get_auth_service)
):
    """Invalidate session by clearing the refresh token cookie and marking DB session as inactive."""
    refresh = request.cookies.get("refresh_token")
    if refresh:
        await service.logout(refresh)
    
    response.delete_cookie("refresh_token")
    return _success({"message": "Logged out successfully"})


@router.get("/me", summary="Get Current Officer Profile")
async def get_me(request: Request, service: AuthService = Depends(get_auth_service)):
    """Return the authenticated officer's profile from the JWT."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth_header[7:]
    claims = decode_token(token)
    return _success({"claims": claims})
