from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket import manager

router = APIRouter(prefix="/chat", tags=["chat"])

@router.websocket("/{room_id}/{user_id}")
async def websocket_endpoint(ws: WebSocket, room_id: str, user_id: str):

    await manager.connect(room_id, ws)
    try:
        while True:
            data = await ws.receive_text()   # wait for a message
            msg = f"{user_id}: {data}"
            await manager.broadcast(room_id, msg, sender_id=ws)
    except WebSocketDisconnect:
        manager.disconnect(room_id, ws)
        await manager.broadcast(room_id, f"{user_id} left the room.", sender_id=ws)