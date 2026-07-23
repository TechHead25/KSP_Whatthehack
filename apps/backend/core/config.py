# ============================================================
# NETRA AI — Backend Configuration
# Pydantic Settings — validates all env vars on startup
# ============================================================
from functools import lru_cache
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "NETRA AI Backend"
    app_version: str = "0.1.0"
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = False
    log_level: str = "INFO"

    # Security — JWT RS256 (keys as base64-encoded PEM)
    jwt_private_key_b64: str = ""
    jwt_public_key_b64: str = ""
    access_token_expire_minutes: int = 60
    refresh_token_expire_hours: int = 24
    max_session_hours: int = 8

    # Demo mode — uses in-memory credentials, no DB required
    demo_mode: bool = False

    # CORS
    cors_origins: list[str] = [
        "http://localhost:3000",
        "https://netra-ai.catalyst.zoho.com",
    ]

    # Database (Catalyst Data Store / PostgreSQL)
    database_url: str = "sqlite+aiosqlite:///./netra_demo.db"

    # Neo4j Graph DB
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "password"

    # Redis (Catalyst Cache)
    redis_url: str = "redis://localhost:6379"

    # MFA
    mfa_issuer: str = "Karnataka State Police NETRA AI"
    mfa_enabled: bool = True

    # Rate limiting
    rate_limit_per_minute: int = 200
    rate_limit_ai_per_minute: int = 20


@lru_cache()
def get_settings() -> Settings:
    return Settings()
