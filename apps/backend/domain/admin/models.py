from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import JSONB

from core.models import Base, UUIDMixin, TimestampMixin

class Role(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "roles"

    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(500))
    # Matrix of permissions stored natively as JSON for maximum flexibility
    permissions = Column(JSONB, default=dict)

class SystemSetting(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "system_settings"

    key = Column(String(100), nullable=False, unique=True, index=True)
    value = Column(JSONB, nullable=False)
    description = Column(String(500))

class FeatureFlag(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "feature_flags"

    name = Column(String(100), nullable=False, unique=True, index=True)
    is_enabled = Column(Boolean, default=False)
    description = Column(String(500))

class APIKey(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "api_keys"

    service_name = Column(String(100), nullable=False, unique=True)
    hashed_key = Column(String(500), nullable=False) # Only store hash in DB
    is_active = Column(Boolean, default=True)
