from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Numeric, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import relationship

from ...core.models import Base, UUIDMixin, TimestampMixin

# Optional: Try to import pgvector, if missing use fallback
try:
    from pgvector.sqlalchemy import Vector
    HAS_PGVECTOR = True
except ImportError:
    HAS_PGVECTOR = False

class FIR(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "firs"

    fir_number = Column(String(50), unique=True, nullable=False)
    station_id = Column(ForeignKey("stations.id"), nullable=False)
    district_id = Column(ForeignKey("districts.id"), nullable=False)
    date_filed = Column(DateTime(timezone=True), nullable=False)
    date_incident = Column(DateTime(timezone=True), nullable=False)
    crime_type = Column(String(50), nullable=False)
    crime_subtype = Column(String(100))
    ipc_sections = Column(ARRAY(String(200)))
    status = Column(String(30), nullable=False, default="OPEN")
    priority = Column(String(20), default="NORMAL")
    description = Column(Text, nullable=False)
    location_text = Column(Text)
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    victim_count = Column(Integer, default=0)
    accused_count = Column(Integer, default=0)
    property_value = Column(Numeric(15, 2))
    reporting_officer_id = Column(ForeignKey("officers.id"))
    investigating_officer_id = Column(ForeignKey("officers.id"))
    summary_ai = Column(Text)
    risk_score = Column(Numeric(5, 2))
    
    if HAS_PGVECTOR:
        embedding_vector = Column(Vector(1536))
    else:
        embedding_vector = Column(ARRAY(Numeric)) # Fallback for local testing

    # Relationships
    station = relationship("Station")
    district = relationship("District")
    reporting_officer = relationship("Officer", foreign_keys=[reporting_officer_id])
    investigating_officer = relationship("Officer", foreign_keys=[investigating_officer_id])
    evidence = relationship("Evidence", back_populates="fir", cascade="all, delete-orphan")
    suspects = relationship("FIRSuspect", back_populates="fir", cascade="all, delete-orphan")


class FIRSuspect(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "fir_suspects"

    fir_id = Column(ForeignKey("firs.id"), nullable=False)
    suspect_id = Column(ForeignKey("suspects.id"), nullable=False)
    role = Column(String(30))
    arrest_date = Column(DateTime(timezone=True))
    bail_status = Column(String(30))

    fir = relationship("FIR", back_populates="suspects")
    suspect = relationship("Suspect")
