import structlog
from typing import List, Dict, Any

from infrastructure.database.neo4j import neo4j_manager

log = structlog.get_logger()

class CypherRepository:
    """
    Handles standard Cypher queries against Neo4j.
    """

    @staticmethod
    async def search_nodes(label: str, property_name: str, search_term: str) -> List[Dict[str, Any]]:
        """Search for nodes using CONTAINS"""
        query = f"""
        MATCH (n:{label})
        WHERE toLower(n.{property_name}) CONTAINS toLower($search_term)
        RETURN n
        LIMIT 25
        """
        records = await neo4j_manager.execute_query(query, search_term=search_term)
        # Parse Neo4j nodes to dictionaries
        return [dict(record["n"].items()) | {"id": record["n"].element_id, "label": list(record["n"].labels)[0]} for record in records]

    @staticmethod
    async def expand_node(node_id: str, hops: int = 1) -> Dict[str, Any]:
        """Expands relationships around a node."""
        # Note: In Neo4j 5, elementId() is used instead of id()
        query = f"""
        MATCH (n)
        WHERE elementId(n) = $node_id
        CALL apoc.path.subgraphAll(n, {{maxLevel: $hops}}) YIELD nodes, relationships
        RETURN nodes, relationships
        """
        # If apoc is not installed, fallback to basic cypher:
        fallback_query = """
        MATCH (n)-[r]-(m)
        WHERE elementId(n) = $node_id
        RETURN n, r, m
        """
        try:
            records = await neo4j_manager.execute_query(query, node_id=node_id, hops=hops)
            # This logic assumes APOC format, which returns lists of nodes and relationships.
            # Simplified mock processing below:
            if not records:
                return {"nodes": [], "edges": []}
            return {"nodes": records[0]["nodes"], "edges": records[0]["relationships"]}
        except Exception as e:
            log.warning("apoc_failed_using_fallback", error=str(e))
            records = await neo4j_manager.execute_query(fallback_query, node_id=node_id)
            nodes = {}
            edges = []
            for r in records:
                n = r["n"]
                m = r["m"]
                rel = r["r"]
                nodes[n.element_id] = n
                nodes[m.element_id] = m
                edges.append(rel)
            return {"nodes": list(nodes.values()), "edges": edges}

cypher_repo = CypherRepository()
