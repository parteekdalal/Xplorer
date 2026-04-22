import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { FaSearch, FaToolbox } from 'react-icons/fa';

import { Header } from '../components/basicComponents.jsx';
import ChatUI from '../components/chat.jsx';

export default function Home() {
    const [currentView, setCurrentView] = useState('discover'); // 'discover' or 'chat'
    const [currentRoom, setCurrentRoom] = useState(null);

    const handleDiscover = () => {
        // Generate a random room ID for now
        const roomId = `r:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
        setCurrentRoom(roomId);
        setCurrentView('chat');
    };

    const handleBackToDiscover = () => {
        setCurrentView('discover');
        setCurrentRoom(null);
    };
    if (currentView === 'discover') {
        return (
            <div id="home-page">
                <Header />
                <Discover onDiscover={handleDiscover} />
            </div>
        )
    } else {
        return (
            <div id="home-page">
                <ChatUI roomId={currentRoom} prev={handleBackToDiscover} />
            </div>
        )
    }
}

function Discover({ onDiscover }) {
    return (
        <div id="discover">
            <button className="btn btn-icon btn-main" title="search" onClick={onDiscover}>
                <FaSearch className="icon"/> Discover
            </button>
            <button className="btn btn-icon" title="preferences">
                <FaToolbox className="icon"/> Preferences
            </button>
        </div>
    )
}
