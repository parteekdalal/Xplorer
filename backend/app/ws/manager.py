from fastapi import WebSocket
from collections import defaultdict

class ConnectionManager:
    def __init__(self):
        # room_id → list of websockets
        self.rooms: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, room_id: str, ws: WebSocket):
        await ws.accept()
        self.rooms[room_id].append(ws) # append ws to the room

    def disconnect(self, room_id: str, ws: WebSocket):
        self.rooms[room_id].remove(ws)
        if not self.rooms[room_id]:
            del self.rooms[room_id]

    async def broadcast(self, room_id: str, message: str, sender_id: WebSocket):
        for connection in self.rooms[room_id]:
            if connection != sender_id:  # don't echo back to sender
                await connection.send_text(message)