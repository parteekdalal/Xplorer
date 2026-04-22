import { useEffect, useRef, useState } from "react";

export default function useWebSocket(url) {
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onmessage = (event) => {
      try {
        const messageObj = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        setMessages((prev) => [...prev, messageObj]);
      } catch (e) {
        // If parsing fails, treat it as a plain string message from other user
        setMessages((prev) => [...prev, { io: 'msg-out', message: event.data }]);
      }
    };

    return () => ws.current.close(); // cleanup on unmount
  }, [url]);

  const send = (messageObj) => {
    if (messageObj.message?.trim()) {
      const msgToSend = typeof messageObj === 'object' ? JSON.stringify(messageObj) : messageObj;
      ws.current?.send(msgToSend);
      setMessages((prev) => [...prev, messageObj]); // Add message object immediately to local state
    }
  };

  return { messages, send };
}