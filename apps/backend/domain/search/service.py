import asyncio
import time
import uuid
import structlog
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import GlobalSearchRequest, GlobalSearchResponse, SearchResultItem, EntityType, AutocompleteResponse
from .models import RecentSearch

log = structlog.get_logger()

class SearchService:
    """
    Federates queries concurrently across Relational, Semantic, and Graph layers.
    """

    async def _search_firs(self, query: str) -> List[SearchResultItem]:
        await asyncio.sleep(0.1) # Simulate DB latency
        if "stolen" in query.lower():
            return [SearchResultItem(entity_type=EntityType.FIR, entity_id="FIR-2026-001", title="Stolen Vehicle - Honda Civic", subtitle="Reported by John Doe")]
        return []

    async def _search_suspects(self, query: str) -> List[SearchResultItem]:
        await asyncio.sleep(0.05)
        if "doe" in query.lower():
            return [SearchResultItem(entity_type=EntityType.SUSPECT, entity_id="SUSP-999", title="Jane Doe", subtitle="Known associate")]
        return []

    async def _search_vehicles(self, query: str) -> List[SearchResultItem]:
        await asyncio.sleep(0.08)
        if "vehicle" in query.lower() or "honda" in query.lower():
            return [SearchResultItem(entity_type=EntityType.VEHICLE, entity_id="VEH-444", title="Honda Civic (KA-01-AB-1234)", subtitle="Flagged in FIR-2026-001")]
        return []

    async def global_search(self, db: AsyncSession, request: GlobalSearchRequest, officer_id: uuid.UUID) -> GlobalSearchResponse:
        start_time = time.time()
        
        # 1. Log to recent searches
        if request.query.strip():
            recent = RecentSearch(officer_id=officer_id, query_string=request.query, filters=request.filters)
            db.add(recent)
            # We don't await commit here in a real scenario, could be background task
            await db.commit()
            
        # 2. Execute federated search concurrently
        log.info("executing_federated_search", query=request.query)
        results = await asyncio.gather(
            self._search_firs(request.query),
            self._search_suspects(request.query),
            self._search_vehicles(request.query)
        )
        
        # 3. Flatten results
        flattened = [item for sublist in results for item in sublist]
        
        execution_time_ms = int((time.time() - start_time) * 1000)
        
        return GlobalSearchResponse(
            total_results=len(flattened),
            execution_time_ms=execution_time_ms,
            items=flattened
        )
        
    async def get_autocomplete(self, db: AsyncSession, query: str) -> AutocompleteResponse:
        # Mocking autocomplete
        return AutocompleteResponse(suggestions=["stolen vehicle", "stolen phone", "suspect doe"])
        
search_service = SearchService()
