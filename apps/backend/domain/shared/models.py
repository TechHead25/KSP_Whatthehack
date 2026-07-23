from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Numeric, Text
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import relationship

from core.models import Base, UUIDMixin, TimestampMixin, AuditMixin

class District(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "districts"

    name = Column(String(100), nullable=False)
    code = Column(String(10), unique=True, nullable=False)
    region = Column(String(50))
    boundary_geojson = Column(JSONB)
    population = Column(Integer)
    area_sq_km = Column(Numeric(10, 2))


class Station(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "stations"

    name = Column(String(150), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    district_id = Column(ForeignKey("districts.id"), nullable=False, index=True)
    investigating_officer_id = Column(ForeignKey("officers.id"), nullable=True, index=True)
    status = Column(String(50), default="OPEN", index=True)
    address = Column(Text)
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    jurisdiction_geojson = Column(JSONB)
    phone = Column(String(15))
    officer_count = Column(Integer, default=0)

    district = relationship("District")


class Officer(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "officers"

    badge_number = Column(String(20), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(15))
    role = Column(String(30), nullable=False)
    rank = Column(String(50), nullable=False)
    password_hash = Column(String(255), nullable=True)
    station_id = Column(ForeignKey("stations.id"))
    district_id = Column(ForeignKey("districts.id"))
    is_active = Column(Boolean, default=True)
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(255), nullable=True)
    last_login = Column(Text) # TIMESTAMPTZ

    station = relationship("Station", foreign_keys=[station_id])
    district = relationship("District", foreign_keys=[district_id])

class AuditLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "audit_logs"

    officer_id = Column(ForeignKey("officers.id"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    entity_type = Column(String(100), nullable=True)
    entity_id = Column(String(100), nullable=True)
    details = Column(JSONB, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)

class Session(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "sessions"

    officer_id = Column(ForeignKey("officers.id"), nullable=False, index=True)
    token = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)

class LoginAttempt(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "login_attempts"

    badge_number = Column(String(20), nullable=False, index=True)
    ip_address = Column(String(45), nullable=True)
    success = Column(Boolean, default=False)
    attempt_time = Column(Text, nullable=False)
