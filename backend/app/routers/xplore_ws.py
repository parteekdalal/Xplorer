from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

from app.websocket import xplore_manager
from app.schemas.user import WSMessage
from app.database.auth import verify_token

router = APIRouter(prefix="/chat", tags=["chat"])

@router.websocket("/{room_id}")
async def websocket_endpoint(ws: WebSocket, room_id: str, token: str):
    payload = verify_token(token)
    if not payload:
        await ws.close(code=1008)
        return
    username = payload["username"]

    await xplore_manager.connect(room_id, ws)
    try:
        while True:
            raw = await ws.receive_text()
            data = WSMessage(**json.loads(raw))
            await xplore_manager.broadcast(room_id, data.model_dump_json(), sender_id=ws)
    except WebSocketDisconnect:
        xplore_manager.disconnect(room_id, ws)
        await xplore_manager.broadcast(room_id, f"{username} left the room.", sender_id=ws)
