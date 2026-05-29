import axios from "axios";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { IoIosArrowBack, IoIosArrowDropdownCircle } from "react-icons/io";
import { SlOptionsVertical } from "react-icons/sl";
import { IoSend } from "react-icons/io5";

import { ProfileMini } from "../components/Profile.jsx";
import { getToken } from "../utils/auth.js";
import useWebSocket from '../hooks/websocket.jsx';

const BACKEND = import.meta.env.VITE_API;
const sender = localStorage.getItem("username");

export default function Chat() {
    const token = getToken();
    const { roomId } = useParams();
    const ws_url = sessionStorage.getItem("ws_url");

    const { messages, members = [], send } = useWebSocket(ws_url);

    return (
        <div id="chat-page" className="container-h">
            <ChatSidebar members={members} />
            <ChatUI roomId={roomId} messages={messages} send={send}/>
        </div>
    )
}

function ChatSidebar({ members }) {
    return (
        <div id="chat-sidebar">
            <h2>active</h2>
            <div className="container-v">
                {members.map((member, key) => (
                    <div key={key} className="member">{member}</div>
                ))}
            </div>
        </div>
    )
}

function ChatUI({roomId, messages, send}) {
    const navigate = useNavigate();
    const [msg, setMsg] = useState({ sender: sender, content: ''});

    const handleSend = useCallback(() => {
        if (msg.content.trim()) {
            send(msg);
            setMsg({ sender: sender, content: ''});
        }
    }, [msg.content, send]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && e.ctrlKey) { handleSend(); }
        else if (e.key === "Escape") { navigate("/"); }
    }, [handleSend, navigate]);
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [handleKeyPress]);

    return (
        <div id="chat-ui">
            <ChatHeader roomId={roomId}/>
            <ChatMessages messages={messages} />
            <ChatInput
                value={msg.content}
                onChange={setMsg}
                onSend={handleSend}
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

            <div id="header-details">
                <h3 className="txt">Chat Room</h3>
                <p className="txt-muted">r:{roomId}</p>
            </div>
            <div className="container-h">
                <button className="btn-mini btn-tertiary">
                    <SlOptionsVertical />
                </button>
            </div>
        </div>
    )
}

function ChatMessages({ messages }) {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) };
    useEffect(scrollToBottom, [messages]);
    return (
        <div className="chat-messages">
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}

            <div ref={messagesEndRef} />
            <button id="down-btn" className="btn btn-tertiary" onClick={scrollToBottom}>
                <IoIosArrowDropdownCircle />
            </button>
        </div>
    )
}

function Message({ message }) {
    const [showProfile, setShowProfile] = useState(false);
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Backspace") { setShowProfile(null);}
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => { document.removeEventListener('keydown', handleKeyPress); };
    }, [showProfile]);
    if (message.sender === "a") {
        return (
            <div className={"msg msg-announcement"}>
                <p className="txt-secondary">{message.content}</p>
            </div>
        )
    } else if (message.sender === sender) {
        return (
            <div className={"msg msg-out"}>
                <p>{message.content}</p>
            </div>
        )
    } else {
        return (
            <div className={"msg msg-in"}>
                <button className="btn btn-tertiary txt-secondary" onClick={() => {setShowProfile(true)}}>{message.sender}</button>
                <p>{message.content}</p>
                {showProfile && <ProfileMini username={message.sender} handleExit={() => {setShowProfile(null)}}/>}
            </div>
            
        )
    }
}

function ChatInput({ value, onChange, onSend, onKeyPress }) {
    const textareaRef = useRef(null)

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "0px";
        el.style.height = el.scrollHeight + "px";
    }, [value])

    return (
        <div id="chat-input-container">
            {
            /* gonna work on attachments later */
            /* <button className="btn btn-icon btn-secondary"><IoMdAttach/></button> */
            }
            <textarea
                className="msg-input input textbox"
                value={value}
                ref={textareaRef}
                onChange={(e) => onChange(prev => ({ ...prev, content: e.target.value }))}
                onKeyPress={onKeyPress}
                placeholder="Type a message..."
                maxLength={1024}
            />

            <button className="btn btn-icon btn-primary" onClick={onSend}>
                <IoSend/>
            </button>
        </div>
    )
}