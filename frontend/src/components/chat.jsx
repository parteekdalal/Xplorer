import axios from "axios";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { IoIosArrowBack, IoMdAttach } from "react-icons/io";
import { SlOptionsVertical } from "react-icons/sl";
import { IoSend } from "react-icons/io5";

import { ProfileMini } from "../components/Profile.jsx";
import { getToken } from "../utils/auth.js";
import useWebSocket from '../hooks/websocket.jsx';

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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) { handleSendMessage(); }
        else if (e.key === "Escape") { navigate("/"); }
    };
    useEffect(() => {
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
                onKeyPress={handleKeyPress}
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
            {/* <img src="/Xplorer.png" className="chat-pfp" /> */}

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
                />
            ))}
        </div>
    )
}

function Message({ message }) {
    const [profile, setProfile] = useState(null);
    function handleClick() {
        setProfile({
            positions: {
                position: "absolute",
                top: "5px",
                left: "10px"
            }
        })
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Backspace") { setProfile(null);}
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => { document.removeEventListener('keydown', handleKeyPress); };
    }, [profile]);
    if (message.sender === "a") {
        return (
            <div className={"msg msg-announcement"}>
                <p className="txt-secondary">{message.message}</p>
            </div>
        )
    } else if (message.sender === sender) {
        return (
            <div className={"msg msg-out"}>
                <p>{message.message}</p>
            </div>
        )
    } else {
        return (
            <div className={"msg msg-in"}>
                <button className="btn btn-tertiary txt-secondary" onClick={handleClick}>{message.sender}</button>
                <p>{message.message}</p>
                {profile && <ProfileMini username={message.sender} positions={profile.positions} handleExit={() => {setProfile(null)}}/>}
            </div>
            
        )
    }
}

function ChatInput({ value, onChange, onSend, onKeyPress }) {
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