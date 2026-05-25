import { useEffect, useRef, useState } from "react";

export default function useWebSocket(url) {
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => { console.log("websocket connected"); };
    ws.current.onmessage = (event) => {
      try {
        const messageObj = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        setMessages((prev) => [...prev, messageObj]);
      } catch (e) {
        setMessages((prev) => [...prev, { sender: "a", message: event.data }]);
      }
    };
    return () => ws.current.close();
  }, [url]);

  const send = (messageObj) => {
    if (messageObj.message?.trim()) {
      const msgToSend = typeof messageObj === 'object' ? JSON.stringify(messageObj) : messageObj;
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(msgToSend);
        setMessages((prev) => [...prev, messageObj]);
      }
    }
  };
  return { messages, send };
}