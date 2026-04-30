import { useState, useEffect } from "react";
import { IoMdMale, IoMdSend, IoMdAttach, IoMdOptions, IoMdArrowBack } from "react-icons/io";
import useWebSocket from '../hooks/websocket';

export default function ChatUI({ roomId, prev}) {
    const [userId] = useState(0);
    const { messages, send } = useWebSocket(`ws://api/chat/${roomId}/${userId}`);
    const [messageContent, setInputMessage] = useState({ io: 'msg-out', message: ''});

    const handleSendMessage = () => {
        if (messageContent.message.trim()) {
            send(messageContent);
            setInputMessage({ io: 'msg-out', message: ''});
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-ui">
            <ChatHeader details={`room: ${roomId}`} prev={prev} />
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

function ChatHeader({ details, prev }) {
    return (
        <div className="chat-header">
            <button id="prev-btn" className="btn" onClick={prev}>
                <IoMdArrowBack />
            </button>
            <img src="/demopfp.webp" alt="profile pic" className="pfp" />

            <h3 className="txt">Chat Room</h3>
            <div className="chat-details">
                <IoMdMale/>
                <p className="text-secondary">{details.slice(0, 20)}...</p>
            </div>

            <div className="chat-options">
                <button className="btn btn-icon">
                    <IoMdOptions/>
                </button>
            </div>
        </div>
    )
}

function ChatMessages({ messages }) {
    return (
        <div className="chat-messages">
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}
        </div>
    )
}

function Message({ message }) {
    return (
        <div className={`msg ${message.io || ''}`}>
            <p className="text-primary">{message.message}</p>
        </div>
    )
}

function ChatInput({ value, onChange, onSend, onKeyPress }) {
    return (
        <div className="chat-input-container">
            <button className="btn-icon"><IoMdAttach/></button>
            <textarea
                className="msg-input input"
                value={value}
                onChange={(e) => {
                    onChange(prev => ({ ...prev, message: e.target.value }))
                    e.target.style.height = "auto"
                    e.target.style.height = e.target.scrollHeight + "px"
                }}
                onKeyPress={onKeyPress}
                placeholder="Type a message..."
                rows={1}
            />

            <button className="btn-mini btn-primary" onClick={onSend}>
                <IoMdSend/>
            </button>
        </div>
    )
}