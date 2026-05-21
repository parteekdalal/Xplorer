from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

from app.websocket import public_rooms_manager
from app.schemas.user import WSMessage
from app.database.auth import verify_token

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/rooms")
async def get_public_rooms():
    return [
        {"room_id": room_id, "members": len(members)}
        for room_id, members in public_rooms_manager.rooms.items()
    ]
@router.get("/room/{room_id}")
async def get_room_info(room_id):
    if room_id not in public_rooms_manager.rooms:
        return {"error": "Room not found"}
    return {
        "room_id": room_id,
        "members": len(public_rooms_manager.rooms[room_id])
    }

@router.websocket("/{room_id}")
async def websocket_endpoint(ws: WebSocket, room_id: str, token: str):
    payload = verify_token(token)
    if not payload:
        await ws.close(code=1008)
        return
    username = payload["username"]
    await public_rooms_manager.connect(room_id, ws)
    try:
        while True:
            raw = await ws.receive_text()
            data = WSMessage(**json.loads(raw))
            await public_rooms_manager.broadcast(room_id, data.model_dump_json(), sender_id=ws)
    except WebSocketDisconnect:
        public_rooms_manager.disconnect(room_id, ws)
        await public_rooms_manager.broadcast(room_id, f"{username} left the room.", sender_id=ws)