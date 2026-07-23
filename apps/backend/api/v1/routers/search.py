import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.catalyst import get_db
from core.responses import SuccessResponse
from domain.search.schemas import GlobalSearchRequest, GlobalSearchResponse, AutocompleteResponse
from domain.search.service import search_service

router = APIRouter(prefix="/search", tags=["Enterprise Search"])

@router.post("/global", response_model=SuccessResponse[GlobalSearchResponse])
async def search_global(
    request: GlobalSearchRequest,
    officer_id: str = Query(..., description="ID of officer for history tracking"),
    db: AsyncSession = Depends(get_db)
):
    """
    Federated search across all platform entities (FIRs, Vehicles, Suspects, Evidence).
    Executes multiple database and semantic queries concurrently.
    """
    data = await search_service.global_search(db, request, uuid.UUID(officer_id))
    return SuccessResponse(data=data)

@router.get("/autocomplete", response_model=SuccessResponse[AutocompleteResponse])
async def search_autocomplete(
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    """
    Provides fast type-ahead suggestions based on history and top hits.
    """
    data = await search_service.get_autocomplete(db, q)
    return SuccessResponse(data=data)
