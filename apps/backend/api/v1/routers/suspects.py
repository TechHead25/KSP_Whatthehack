import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ....infrastructure.database.catalyst import get_db
from ....core.responses import SuccessResponse
from ....domain.suspects.schemas import DigitalTwinProfile, SuspectCreate
from ....domain.suspects.service import suspect_service
from ....domain.suspects.repository import suspect_repo

router = APIRouter(prefix="/suspects", tags=["Digital Twin (Suspects)"])

@router.get("/{suspect_id}/twin", response_model=SuccessResponse[DigitalTwinProfile])
async def get_digital_twin(
    suspect_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve the full Digital Twin profile for a suspect, merging relational data, 
    AI predictions, and dynamic Graph relationships.
    """
    twin = await suspect_service.get_digital_twin(db, suspect_id)
    if not twin:
        raise HTTPException(status_code=404, detail="Suspect profile not found.")
    
    return SuccessResponse(data=twin)

@router.post("", response_model=SuccessResponse[Dict[str, Any]])
async def create_suspect(
    request: SuspectCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a basic suspect profile. AI Insights are generated asynchronously later."""
    suspect = await suspect_repo.create(db, request)
    return SuccessResponse(data={"id": suspect.id}, message="Suspect created successfully")
    
@router.patch("/{suspect_id}/insights", response_model=SuccessResponse[Dict[str, Any]])
async def update_ai_insights(
    suspect_id: uuid.UUID,
    insights: Dict[str, Any], # Dynamic JSON
    db: AsyncSession = Depends(get_db)
):
    """
    Update the JSONB AI insights block. Usually invoked by background Python cron jobs 
    running nightly ML inference models.
    """
    suspect = await suspect_repo.get(db, suspect_id)
    if not suspect:
         raise HTTPException(status_code=404, detail="Suspect not found")
         
    await suspect_repo.update(db, suspect, {"ai_profile_insights": insights})
    return SuccessResponse(message="AI Insights updated successfully")
