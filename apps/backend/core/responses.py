# ============================================================
# NETRA AI — Standard API Responses
# Per API_SPEC.md §2 Standard Response Envelope
# ============================================================
from datetime import datetime, timezone
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationMeta(BaseModel):
    page: int
    per_page: int
    total: int
    total_pages: int


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T
    meta: PaginationMeta | None = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
