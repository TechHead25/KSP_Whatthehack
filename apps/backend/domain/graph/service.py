import structlog
from typing import Dict, Any

from .schemas import GraphResponse, GraphNode, GraphEdge, PathfindingResponse, CentralityResponse, CentralityScore, CommunityResponse, CommunityCluster
from .repository import cypher_repo
from .algorithms import graph_algorithms

log = structlog.get_logger()

class GraphService:
    """
    Orchestrates business logic for Graph Intelligence.
    Converts raw neo4j dictionaries into Pydantic responses.
    """

    @staticmethod
    def _parse_neo4j_node(n: Any) -> GraphNode:
        # Depending on if it's a dict from our mock or a neo4j Node object
        if isinstance(n, dict):
            return GraphNode(
                id=str(n.get("id", "")),
                label=n.get("label", "Unknown"),
                properties={k: v for k, v in n.items() if k not in ["id", "label"]}
            )
        # Real neo4j.graph.Node
        return GraphNode(
            id=str(n.element_id),
            label=list(n.labels)[0] if n.labels else "Unknown",
            properties=dict(n.items())
        )

    @staticmethod
    def _parse_neo4j_edge(e: Any) -> GraphEdge:
        if isinstance(e, dict):
             return GraphEdge(
                id=str(e.get("id", "")),
                source=str(e.get("source", "")),
                target=str(e.get("target", "")),
                type=e.get("type", "UNKNOWN"),
                properties={k: v for k, v in e.items() if k not in ["id", "source", "target", "type"]},
                weight=e.get("weight", 1.0)
            )
        # Real neo4j.graph.Relationship
        return GraphEdge(
            id=str(e.element_id),
            source=str(e.start_node.element_id),
            target=str(e.end_node.element_id),
            type=e.type,
            properties=dict(e.items())
        )

    async def search_network(self, label: str, property_name: str, search_term: str) -> GraphResponse:
        nodes_raw = await cypher_repo.search_nodes(label, property_name, search_term)
        nodes = [self._parse_neo4j_node(n) for n in nodes_raw]
        return GraphResponse(nodes=nodes, edges=[])

    async def expand_network(self, node_id: str, hops: int = 1) -> GraphResponse:
        data = await cypher_repo.expand_node(node_id, hops)
        nodes = [self._parse_neo4j_node(n) for n in data["nodes"]]
        edges = [self._parse_neo4j_edge(e) for e in data["edges"]]
        return GraphResponse(nodes=nodes, edges=edges)

    async def find_shortest_path(self, source_id: str, target_id: str) -> PathfindingResponse:
        data = await graph_algorithms.shortest_path(source_id, target_id)
        nodes = [self._parse_neo4j_node(n) for n in data["nodes"]]
        edges = [self._parse_neo4j_edge(e) for e in data["edges"]]
        return PathfindingResponse(path_nodes=nodes, path_edges=edges)

    async def get_centrality(self, label: str = "Suspect") -> CentralityResponse:
        scores_raw = await graph_algorithms.pagerank_centrality(label)
        scores = [CentralityScore(**s) for s in scores_raw]
        return CentralityResponse(scores=scores)

    async def get_communities(self, label: str = "Suspect") -> CommunityResponse:
        clusters_raw = await graph_algorithms.louvain_communities(label)
        clusters = [CommunityCluster(**c) for c in clusters_raw]
        return CommunityResponse(clusters=clusters)

graph_service = GraphService()
