from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
import json

from app.websocket import public_rooms_manager as manager
from app.schemas.user import WSMessage
from app.database.auth import verify_token

router = APIRouter(prefix="/public", tags=["public"])

# END POINTS
@router.get("/rooms")
async def get_public_rooms() -> list[dict[str,int]]:
    return [
        {"room_id": room_id, "members": len(members)}
        for room_id, members in manager.rooms.items()
    ]
@router.get("/room/{room_id}")
async def get_room_info(room_id):
    if room_id not in manager.rooms:
        return {"error": "room not found"}
    return {
        "room_id": room_id,
        "size": manager.room_size(room_id),
        "members": manager.get_members(room_id)
    }

# WEBSOCKETS
@router.websocket("/{room_id}")
async def websocket_endpoint(ws: WebSocket, room_id: str, token: str):
    payload = verify_token(token)
    if not payload:
        await ws.close(code=1008)
        raise HTTPException(status_code=401, detail="access_token expired - login again.")
    sender = payload["username"]
    await manager.connect(room_id, ws, sender)
    try:
        while True:
            raw = await ws.receive_text()
            data = WSMessage(**json.loads(raw))
            await manager.broadcast(room_id, data.model_dump_json(), exclude=sender)
    except WebSocketDisconnect: manager.disconnect(room_id, sender)
