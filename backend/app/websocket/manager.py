from fastapi import WebSocket
from collections import defaultdict
from app.core.logger import logger
class ConnectionManager:
    def __init__(self):
        logger.info("Initializing ConnectionManager")
        self.rooms: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, room_id: str, ws: WebSocket):
        logger.info(f"Connecting to room {room_id}")
        await ws.accept()
        self.rooms[room_id].append(ws) # append ws to the room

    def disconnect(self, room_id: str, ws: WebSocket):
        logger.info(f"Disconnecting from room {room_id}")
        self.rooms[room_id].remove(ws)
        if not self.rooms[room_id]:
            del self.rooms[room_id]

    async def broadcast(self, room_id: str, message: str, sender_id: WebSocket):
        logger.info(f"Broadcasting message to room {room_id}")
        for connection in self.rooms[room_id]:
            if connection != sender_id:  # don't echo back to sender
                await connection.send_text(message)