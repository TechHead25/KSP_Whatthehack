from sqlalchemy import Column, String, Float, ForeignKey, Date, Text, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from ...core.models import Base, UUIDMixin, TimestampMixin

class Suspect(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "suspects"

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    gender = Column(String(20))
    date_of_birth = Column(Date)
    
    # Biometrics / IDs
    aadhar_number = Column(String(20), unique=True, index=True)
    pan_number = Column(String(20), unique=True)
    photograph_url = Column(String(500))
    
    # Scores
    heat_score = Column(Float, default=0.0) # 0 to 100
    risk_score = Column(Float, default=0.0) # 0 to 100
    
    # AI Digital Twin Insights (Crime Pattern, Behavior, Summary, Predictions, Recommendations)
    ai_profile_insights = Column(JSONB, default=dict)
    
    # Relationships
    aliases = relationship("SuspectAlias", back_populates="suspect", cascade="all, delete-orphan")
    phones = relationship("SuspectPhone", back_populates="suspect", cascade="all, delete-orphan")
    vehicles = relationship("SuspectVehicle", back_populates="suspect", cascade="all, delete-orphan")
    addresses = relationship("SuspectAddress", back_populates="suspect", cascade="all, delete-orphan")


class SuspectAlias(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "suspect_aliases"
    suspect_id = Column(ForeignKey("suspects.id"), nullable=False)
    alias_name = Column(String(100), nullable=False)
    suspect = relationship("Suspect", back_populates="aliases")


class SuspectPhone(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "suspect_phones"
    suspect_id = Column(ForeignKey("suspects.id"), nullable=False)
    phone_number = Column(String(20), nullable=False, index=True)
    provider = Column(String(50))
    is_active = Column(Boolean, default=True)
    suspect = relationship("Suspect", back_populates="phones")


class SuspectVehicle(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "suspect_vehicles"
    suspect_id = Column(ForeignKey("suspects.id"), nullable=False)
    license_plate = Column(String(30), nullable=False, index=True)
    make_model = Column(String(100))
    color = Column(String(30))
    suspect = relationship("Suspect", back_populates="vehicles")


class SuspectAddress(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "suspect_addresses"
    suspect_id = Column(ForeignKey("suspects.id"), nullable=False)
    address_line = Column(Text, nullable=False)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(20))
    address_type = Column(String(50)) # e.g., 'PERMANENT', 'LAST_KNOWN'
    suspect = relationship("Suspect", back_populates="addresses")
