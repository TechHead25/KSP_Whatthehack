# ============================================================
# NETRA AI — Custom Exception Hierarchy
# Per CODING_STANDARDS.md §Python Standards
# ============================================================
from typing import Any


class NETRABaseException(Exception):
    """Root exception for all NETRA AI application errors."""
    code: str = "INTERNAL_ERROR"
    message: str = "An unexpected error occurred"
    http_status: int = 500
    details: dict[str, Any] | None = None

    def __init__(
        self,
        message: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message or self.__class__.message
        self.details = details
        super().__init__(self.message)


# ── Authentication Exceptions ────────────────────────────────

class AuthException(NETRABaseException):
    http_status = 401


class InvalidCredentialsException(AuthException):
    code = "AUTH_INVALID_CREDENTIALS"
    message = "Invalid badge number or password"


class TokenExpiredException(AuthException):
    code = "AUTH_TOKEN_EXPIRED"
    message = "Your session has expired. Please log in again"


class MFARequiredException(AuthException):
    code = "AUTH_MFA_REQUIRED"
    message = "Multi-factor authentication is required"
    http_status = 403


class MFAInvalidException(AuthException):
    code = "AUTH_MFA_INVALID"
    message = "Invalid or expired OTP code"


class AccountLockedException(AuthException):
    code = "AUTH_ACCOUNT_LOCKED"
    message = "Account locked due to too many failed attempts. Try again in 15 minutes"


# ── Authorization Exceptions ─────────────────────────────────

class PermissionException(NETRABaseException):
    http_status = 403


class InsufficientPermissionsException(PermissionException):
    code = "AUTH_INSUFFICIENT_PERMISSIONS"
    message = "You do not have permission to perform this action"


class JurisdictionViolationException(PermissionException):
    code = "AUTH_JURISDICTION_VIOLATION"
    message = "This resource is outside your jurisdiction"


# ── Resource Exceptions ──────────────────────────────────────

class ResourceNotFoundException(NETRABaseException):
    code = "RESOURCE_NOT_FOUND"
    message = "The requested resource was not found"
    http_status = 404


class OfficerNotFoundException(ResourceNotFoundException):
    code = "OFFICER_NOT_FOUND"
    message = "Officer not found"


# ── Rate Limiting ────────────────────────────────────────────

class RateLimitException(NETRABaseException):
    code = "RATE_LIMIT_EXCEEDED"
    message = "Too many requests. Please slow down"
    http_status = 429


# ── Validation ───────────────────────────────────────────────

class ValidationException(NETRABaseException):
    code = "VALIDATION_ERROR"
    message = "Request validation failed"
    http_status = 422
