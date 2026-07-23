# ============================================================
# NETRA AI — Neo4j Graph Connection Manager
# ============================================================
import structlog
from neo4j import AsyncGraphDatabase, AsyncDriver
from core.config import get_settings

settings = get_settings()
log = structlog.get_logger()

class Neo4jManager:
    """Manages the Neo4j async driver lifecycle."""
    def __init__(self):
        self.driver: AsyncDriver | None = None

    async def connect(self):
        """Initialize the Neo4j driver."""
        if not settings.neo4j_uri:
            log.warning("neo4j_uri_missing", msg="Neo4j connection disabled. Running in degraded mode.")
            return

        try:
            self.driver = AsyncGraphDatabase.driver(
                settings.neo4j_uri,
                auth=(settings.neo4j_user, settings.neo4j_password) if settings.neo4j_user else None,
            )
            await self.driver.verify_connectivity()
            log.info("neo4j_connected", uri=settings.neo4j_uri)
        except Exception as e:
            log.error("neo4j_connection_failed", error=str(e))
            self.driver = None

    async def disconnect(self):
        """Close the Neo4j driver."""
        if self.driver:
            await self.driver.close()
            log.info("neo4j_disconnected")
            self.driver = None

    async def get_session(self):
        """Get an async session for executing Cypher queries."""
        if not self.driver:
            raise RuntimeError("Neo4j driver is not initialized.")
        return self.driver.session()


# Global Neo4j manager instance
neo4j_manager = Neo4jManager()
