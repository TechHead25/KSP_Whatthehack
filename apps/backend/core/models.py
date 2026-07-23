# ============================================================
# NETRA AI — Base SQLAlchemy Models & Mixins
# ============================================================
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, MetaData
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase

# Use a naming convention for standard constraint naming
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=convention)


class Base(DeclarativeBase):
    metadata = metadata

    @declared_attr.directive
    def __tablename__(cls) -> str:
        """Generate __tablename__ automatically from class name."""
        return cls.__name__.lower() + "s"


class UUIDMixin:
    """Provides a UUID primary key for models."""
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )


class TimestampMixin:
    """Provides created_at and updated_at timestamps."""
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class AuditMixin:
    """Provides created_by for auditing."""
    @declared_attr
    def created_by(cls):
        from sqlalchemy import ForeignKey
        return Column(UUID(as_uuid=True), ForeignKey('officers.id'), nullable=True)
