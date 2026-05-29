import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function useWebSocket(url) {
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => { console.log("websocket connected"); };
    ws.current.onmessage = (event) => {
      try {
        const messageObj = JSON.parse(event.data);
        
        // append new message
        if (messageObj.content_type === "room_members") { setMembers(messageObj.content); }
        else { setMessages((prev) => [...prev, messageObj]); }
      } catch (e) {toast.warn(e.message);}
    };
    return () => ws.current.close();
  }, [url]);

  const send = (messageObj) => {
    if (messageObj.content?.trim()) {
      const msgToSend = JSON.stringify(messageObj);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(msgToSend);
        setMessages((prev) => [...prev, messageObj]);
      }
    }
  };
  return { messages, members, send };
}