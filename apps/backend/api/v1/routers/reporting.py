from fastapi import APIRouter
from typing import List

from core.responses import SuccessResponse
from domain.reporting.schemas import ReportRequest, ReportResponse, ReportType
from domain.reporting.service import reporting_service

router = APIRouter(prefix="/reports", tags=["Enterprise Reporting"])

@router.post("/generate", response_model=SuccessResponse[ReportResponse])
async def generate_report(request: ReportRequest):
    """
    Dynamically generates a Court-ready, digitally signed PDF and uploads it to Catalyst Storage.
    Returns the Catalyst secure download URL.
    """
    data = await reporting_service.create_report(request)
    return SuccessResponse(data=data, message="Report generated successfully.")

@router.get("/types", response_model=SuccessResponse[List[str]])
async def list_report_types():
    """Lists all available enterprise report types."""
    types = [t.value for t in ReportType]
    return SuccessResponse(data=types)
