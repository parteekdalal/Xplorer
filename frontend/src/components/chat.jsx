import { useState, useEffect } from "react";
import { IoMdMale, IoMdSend, IoMdAttach, IoMdOptions, IoMdArrowBack } from "react-icons/io";
import useWebSocket from '../hooks/websocket';

const sender = localStorage.getItem("username");
const token = localStorage.getItem("access_token");

export default function ChatUI({ roomId, prev}) {
    const [otherPerson, setOtherPerson] = useState(null);
    const { messages, send } = useWebSocket(`ws://localhost:8000/chat/${roomId}?token=${token}`);
    const [messageContent, setInputMessage] = useState({ sender: sender, message: ''});

    const handleSendMessage = () => {
        if (messageContent.message.trim()) {
            send(messageContent);
            setInputMessage({ sender: sender, message: ''});
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-ui">
            <ChatHeader details={roomId} prev={prev} />
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
                <p className="text-secondary">{details}...</p>
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
            {console.log(message)}
            <h4>{message.sender}</h4>
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