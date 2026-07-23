from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class GraphNode(BaseModel):
    id: str
    label: str
    properties: Dict[str, Any]

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str
    properties: Dict[str, Any]
    weight: Optional[float] = 1.0

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class PathfindingResponse(BaseModel):
    path_nodes: List[GraphNode]
    path_edges: List[GraphEdge]
    total_cost: Optional[float] = None

class CentralityScore(BaseModel):
    node_id: str
    node_name: str
    score: float

class CentralityResponse(BaseModel):
    scores: List[CentralityScore]

class CommunityCluster(BaseModel):
    community_id: int
    node_ids: List[str]

class CommunityResponse(BaseModel):
    clusters: List[CommunityCluster]

class SimilarityScore(BaseModel):
    node_id_1: str
    node_id_2: str
    similarity: float
