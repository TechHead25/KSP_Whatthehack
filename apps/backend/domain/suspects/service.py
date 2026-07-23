import uuid
import structlog
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import DigitalTwinProfile, AIInsights
from .repository import suspect_repo
from ..graph.service import graph_service

log = structlog.get_logger()

class SuspectService:
    """
    Business logic for Suspects. Aggregates data from Postgres (Structured)
    and Graph (Associates) into a unified Digital Twin.
    """

    async def get_digital_twin(self, db: AsyncSession, suspect_id: uuid.UUID) -> Optional[DigitalTwinProfile]:
        # 1. Fetch Structured Data (Eagerly Loaded from Postgres)
        suspect = await suspect_repo.get_digital_twin_data(db, suspect_id)
        if not suspect:
            return None

        # Transform raw model to schema
        base_dict = {
            "id": suspect.id,
            "first_name": suspect.first_name,
            "last_name": suspect.last_name,
            "gender": suspect.gender,
            "date_of_birth": suspect.date_of_birth,
            "aadhar_number": suspect.aadhar_number,
            "pan_number": suspect.pan_number,
            "photograph_url": suspect.photograph_url,
            "heat_score": suspect.heat_score,
            "risk_score": suspect.risk_score,
            "aliases": [a.__dict__ for a in suspect.aliases],
            "phones": [p.__dict__ for p in suspect.phones],
            "vehicles": [v.__dict__ for v in suspect.vehicles],
            "addresses": [a.__dict__ for a in suspect.addresses],
            "created_at": suspect.created_at,
            "updated_at": suspect.updated_at,
        }
        
        # 2. Inject AI Insights (From JSONB)
        ai_data = suspect.ai_profile_insights or {}
        base_dict["ai_insights"] = AIInsights(**ai_data)
        
        # 3. Retrieve Dynamic Graph Data (Known Associates)
        # We query the Neo4j Graph for 1-hop expansions specifically tracking relationships
        try:
            # We mock the node element ID format since Postgres UUID != Neo4j ElementID directly 
            # unless synced perfectly. In production, Postgres UUID is a property on Neo4j Node.
            graph_data = await graph_service.expand_network(node_id=str(suspect_id), hops=1)
            associates = []
            for edge in graph_data.edges:
                # Simple logic to find the 'other' node
                target_id = edge.target if edge.source == str(suspect_id) else edge.source
                associates.append({
                    "suspect_id": target_id,
                    "name": "Unknown Associate", # Would resolve from graph nodes
                    "relationship_strength": edge.weight or 0.5
                })
            base_dict["known_associates"] = associates
        except Exception as e:
            log.warning("graph_associates_fetch_failed", error=str(e))
            base_dict["known_associates"] = []
            
        # 4. Mock Timeline (Would typically query FIR/Cases temporal repo)
        base_dict["timeline"] = [
            {"date": "2023-05-12", "title": "First Arrest", "description": "Arrested for burglary.", "type": "ARREST"}
        ]

        return DigitalTwinProfile(**base_dict)

suspect_service = SuspectService()
