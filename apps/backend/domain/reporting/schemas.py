from enum import Enum
from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime

class ReportType(str, Enum):
    COURT = "COURT"
    CASE = "CASE"
    INVESTIGATION = "INVESTIGATION"
    OFFICER = "OFFICER"
    TIMELINE = "TIMELINE"
    EVIDENCE = "EVIDENCE"

class ReportRequest(BaseModel):
    report_type: ReportType
    target_id: UUID4 # ID of the FIR, Suspect, Officer, etc.
    include_charts: bool = False
    include_graph_snapshot: bool = False

class ReportMetadata(BaseModel):
    generated_at: datetime
    generator_id: str
    digital_signature_ready: bool
    page_count: int

class ReportResponse(BaseModel):
    report_id: UUID4
    download_url: str
    metadata: ReportMetadata
