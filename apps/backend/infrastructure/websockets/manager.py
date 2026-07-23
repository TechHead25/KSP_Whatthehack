# ============================================================
# NETRA AI — WebSocket Connection Manager
# ============================================================
from typing import Dict, List
import structlog
from fastapi import WebSocket

log = structlog.get_logger()

class WebSocketManager:
    """
    Manages active WebSocket connections for real-time dashboard updates and alerts.
    """
    def __init__(self):
        # Maps officer UUID to their active websocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, officer_id: str, websocket: WebSocket):
        await websocket.accept()
        if officer_id not in self.active_connections:
            self.active_connections[officer_id] = []
        self.active_connections[officer_id].append(websocket)
        log.info("websocket_connected", officer_id=officer_id)

    def disconnect(self, officer_id: str, websocket: WebSocket):
        if officer_id in self.active_connections:
            self.active_connections[officer_id].remove(websocket)
            if not self.active_connections[officer_id]:
                del self.active_connections[officer_id]
        log.info("websocket_disconnected", officer_id=officer_id)

    async def send_personal_message(self, message: dict, officer_id: str):
        """Send a message to a specific officer (all their active tabs)."""
        if officer_id in self.active_connections:
            for connection in self.active_connections[officer_id]:
                await connection.send_json(message)

    async def broadcast_to_district(self, message: dict, district_id: str):
        """
        Broadcast an alert to all officers in a specific district.
        In a multi-node deployment, this would use Redis Pub/Sub.
        """
        # TODO: Implement Redis Pub/Sub for multi-instance broadcast
        pass

websocket_manager = WebSocketManager()
