import json
from fastapi import WebSocket
from collections import defaultdict
from typing import Optional

from app.core.logger import logger
from app.schemas.user import WSMessage

class ConnectionManager:
    def __init__(self):
        logger.info("Initializing ConnectionManager")
        # rooms = {"room_123 : {"username1" : ws1, "username2" : ws2}}
        self.rooms: dict[str, dict[str, WebSocket]] = defaultdict(dict)

    # LIFECYCLE
    async def connect(self, room_id: str, ws: WebSocket, username: str):
        await ws.accept()
        is_new = username not in self.get_members(room_id)
        self.rooms[room_id][username] = ws
        if is_new:
            logger.info(f"[{room_id}] {username} connected ({self.room_size(room_id)} online)")
            msg = WSMessage(content=f"{username} joined the room.")
            await self.broadcast(room_id, msg.model_dump_json())

        await self.broadcast_members(room_id)

    async def disconnect(self, room_id: str, username: str):
        self.rooms[room_id].pop(username, None) 
        logger.info(f"disconnected {username} from room: {room_id}")

        if not self.rooms[room_id]:
            del self.rooms[room_id]
            logger.info(f"[{room_id}] empty, removed")
        else:
            await self.broadcast_members(room_id)
            msg = WSMessage(f"{username} left the room.")
            await self.broadcast(room_id, msg.model_dump_json())

    # MEMEBERS
    def get_members(self, room_id: str) -> list[str]:
        return list(self.rooms.get(room_id, {}).keys())
    
    def room_size(self, room_id: str) -> int:
        return len(self.rooms.get(room_id, {}))
    
    async def broadcast_members(self, room_id: str):
        payload = json.dumps({"content_type": "room_members", "content": self.get_members(room_id)})
        await self.broadcast(room_id, payload)


    # MESSAGING
    async def broadcast(self, room_id: str, message: str, exclude: Optional[str] = None):
        for username, ws in self.rooms.get(room_id, {}).items():
            if username != exclude: await self._send(ws, message)

    async def send_to_user(self, room_id: str, username: str, message: str):
        """
        Message a single user in the room.
        """
        ws = self.rooms.get(room_id, {}).get(username)
        if ws: await self._send(ws, message)

    # INTERNALS
    async def _send(self, ws: WebSocket, payload: str):
        try:
            await ws.send_text(payload)
        except Exception as e:
            logger.warning(f"Failed to send to client: {e}")

    # TODO PERSISTENCE

