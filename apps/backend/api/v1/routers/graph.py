from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from ....core.responses import SuccessResponse

from ....domain.graph.schemas import GraphResponse, PathfindingResponse, CentralityResponse, CommunityResponse
from ....domain.graph.service import graph_service

router = APIRouter(prefix="/graph", tags=["Graph Intelligence"])

@router.get("/search", response_model=SuccessResponse[GraphResponse])
async def search_graph(
    label: str = Query("Suspect"),
    property_name: str = Query("name"),
    search_term: str = Query(...)
):
    """Search for nodes in the graph to start an investigation."""
    data = await graph_service.search_network(label, property_name, search_term)
    return SuccessResponse(data=data)

@router.get("/node/{node_id}/expand", response_model=SuccessResponse[GraphResponse])
async def expand_node(
    node_id: str,
    hops: int = Query(1, ge=1, le=3)
):
    """Expand relationships around a specific node up to N hops."""
    data = await graph_service.expand_network(node_id, hops)
    return SuccessResponse(data=data)

@router.get("/path", response_model=SuccessResponse[PathfindingResponse])
async def shortest_path(
    source_id: str = Query(...),
    target_id: str = Query(...)
):
    """Find the shortest path connecting two nodes."""
    data = await graph_service.find_shortest_path(source_id, target_id)
    return SuccessResponse(data=data)

@router.get("/algorithms/centrality", response_model=SuccessResponse[CentralityResponse])
async def centrality(label: str = Query("Suspect")):
    """Identify the most central nodes (Kingpins) using PageRank."""
    data = await graph_service.get_centrality(label)
    return SuccessResponse(data=data)

@router.get("/algorithms/communities", response_model=SuccessResponse[CommunityResponse])
async def communities(label: str = Query("Suspect")):
    """Detect network clusters using Louvain community detection."""
    data = await graph_service.get_communities(label)
    return SuccessResponse(data=data)
