from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
import json

from app.websocket import xplore_manager as manager
from app.schemas.user import WSMessage
from app.database.auth import verify_token

router = APIRouter(prefix="/chat", tags=["chat"])

@router.websocket("/{room_id}")
async def websocket_endpoint(ws: WebSocket, room_id: str, token: str):
    payload = verify_token(token)
    if not payload:
        await ws.close(code=1008)
        raise HTTPException(status_code=401, detail="access_token expired - log in again.")
    sender = payload["username"]
    await manager.connect(room_id, ws, sender)
    try:
        while True:
            raw = await ws.receive_text()
            msg = WSMessage(**json.loads(raw))
            await manager.broadcast(room_id, msg.model_dump_json(), exclude=sender)
    except WebSocketDisconnect: await manager.disconnect(room_id, sender)