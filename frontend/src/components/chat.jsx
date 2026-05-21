import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { IoIosArrowBack } from "react-icons/io";
import { SlOptionsVertical } from "react-icons/sl";
import { IoMdAttach} from "react-icons/io";
import { IoSend } from "react-icons/io5";

import { getToken } from "../utils/auth";
import useWebSocket from '../hooks/websocket';

const BACKEND = import.meta.env.VITE_API;
const sender = localStorage.getItem("username");

export default function ChatUI() {
    const token = getToken();
    const { roomId } = useParams();
    const ws_url = sessionStorage.getItem("ws_url");

    const navigate = useNavigate();
    const { messages, send } = useWebSocket(ws_url);
    const [messageContent, setInputMessage] = useState({ sender: sender, message: ''});

    const handleSendMessage = useCallback(() => {
        if (messageContent.message.trim()) {
            send(messageContent);
            setInputMessage({ sender: sender, message: ''});
        }
    }, [messageContent.message, send]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                handleSendMessage();
            }
            else if (e.key === "Escape") {
                navigate("/");
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => { document.removeEventListener('keydown', handleKeyPress); };
    }, [handleSendMessage, navigate]);

    return (
        <div id="chat-ui">
            <ChatHeader roomId={roomId}/>
            <ChatMessages messages={messages} />
            <ChatInput
                value={messageContent.message}
                onChange={setInputMessage}
                onSend={handleSendMessage}
            />
        </div>
    )
}

function ChatHeader({ roomId }) {
    const navigate = useNavigate();
    const [roomInfo, setRoomInfo] = useState(null);
    const getRoomInfo = async () => {
        try {
            const response = await axios.get(`http://${BACKEND}/public/room/${roomId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch room info:", error.message);
            return null;
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            const data = await getRoomInfo();
            if (data) { setRoomInfo(data); }
        };
        fetchData();
    }, [roomId]);

    return (
        <div id="chat-header">
            <button id="prev-btn" className="btn btn-tertiary" onClick={() => { navigate("/"); }}>
                <IoIosArrowBack />
            </button>
            <img src="/Xplorer.png" className="chat-pfp" />

            <div id="chat-details">
                <h3 className="txt">Chat Room</h3>
                <p className="txt-muted">r:{roomId}</p>
            </div>
            <div id="chat-options">
                <button className="btn-mini btn-tertiary">
                    <SlOptionsVertical />
                </button>
            </div>
        </div>
    )
}

function ChatMessages({ messages }) {
    return (
        <div className="chat-messages">
            {messages.map((message, index) => (
                <Message
                    key={index}
                    message={message}
                    io={message.sender === sender ? "msg-out" : "msg-in"}
                />
            ))}
        </div>
    )
}

function Message({ message, io }) {
    return (
        <div className={`msg ${io}`}>
            <button className="btn btn-tertiary">{message.sender}</button>
            <p className="text-primary">{message.message}</p>
        </div>
    )
}

function ChatInput({ value, onChange, onSend, onKeyPress }) {
    const handleInput = (e) => {
        onChange(prev => ({ ...prev, message: e.target.value }))
        e.target.style.height = "0px";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    const textareaRef = useRef(null)

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "40px";
        el.style.height = el.scrollHeight + "px";
    }, [value])



    return (
        <div className="chat-input-container">
            <button className="btn btn-icon btn-secondary"><IoMdAttach/></button>
            <textarea
                className="msg-input input"
                value={value}
                ref={textareaRef}
                onChange={(e) => onChange(prev => ({ ...prev, message: e.target.value }))}
                onKeyPress={onKeyPress}
                placeholder="Type a message..."
                rows={1}
            />

            <button className="btn btn-icon btn-primary" onClick={onSend}>
                <IoSend/>
            </button>
        </div>
    )
}