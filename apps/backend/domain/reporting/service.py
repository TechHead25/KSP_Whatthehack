import uuid
from datetime import datetime, timezone
import structlog

from .schemas import ReportRequest, ReportResponse, ReportMetadata
from .generator import pdf_generator
from infrastructure.storage.file_store import file_store as catalyst_storage

log = structlog.get_logger()

class ReportingService:
    """
    Orchestrates report generation and Catalyst File Store integration.
    """

    async def create_report(self, request: ReportRequest) -> ReportResponse:
        report_id = uuid.uuid4()
        
        # 1. Prepare rendering context
        context = {
            "include_charts": request.include_charts,
            "include_graph_snapshot": request.include_graph_snapshot
        }
        
        # 2. Generate PDF binary payload
        pdf_bytes = await pdf_generator.generate_pdf(
            report_type=request.report_type,
            target_id=str(request.target_id),
            context=context
        )
        
        # 3. Upload to Catalyst File Store
        file_name = f"{request.report_type.value.lower()}_{request.target_id}_{report_id}.pdf"
        file_url = await catalyst_storage.upload_file(
            file_bytes=pdf_bytes,
            file_name=file_name,
            content_type="application/pdf",
            metadata={
                "report_type": request.report_type.value,
                "target_id": str(request.target_id)
            }
        )
        
        # 4. Construct Response
        metadata = ReportMetadata(
            generated_at=datetime.now(timezone.utc),
            generator_id="SYSTEM_AUTO",
            digital_signature_ready=True,
            page_count=5 # Mocked count
        )
        
        return ReportResponse(
            report_id=report_id,
            download_url=file_url,
            metadata=metadata
        )

reporting_service = ReportingService()
