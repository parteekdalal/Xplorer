import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { FaSearch, FaToolbox } from 'react-icons/fa';

import { Header } from '../components/basicComponents.jsx';
import ChatUI from '../components/chat.jsx';

export default function Home() {
    const [currentView, setCurrentView] = useState('xplore'); // 'xplore' or 'chat'
    const [currentRoom, setCurrentRoom] = useState(null);
    const [loading, setLoading] = useState(null);

    const handleXplore = async () => {
        const xploreReq = {
            username: localStorage.getItem("username"),
            preferred_gender: localStorage.getItem("preferred_gender") || "a"
        }
        try {
            const response = await fetch("/api/user/xplore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(xploreReq)
            });
            if (!response.ok) {
                const text = await response.text();
                console.error("Server error:", text); console.error("error: no response"); return;
                return;
            }
            const data = await response.json()
            if (data.message === "could not find a match.") {
                alert(data.message);
                return;
            }
            console.log(data);

            setCurrentRoom(data.room_id);
            sessionStorage.setItem("waitlist_profile", JSON.stringify(data.waitlist_profile));
            setCurrentView('chat');
        } catch (error) {
            console.error("error",error);
        };
    }

    const handleBackToXplore = () => {
        setCurrentView('xplore');
        setCurrentRoom(null);
    };
    if (currentView === 'xplore') {
        return (
            <div id="home-page">
                <Header />
                <h2 className="txt">Find people like you...</h2>
                <Xplore onXplore={handleXplore} />
            </div>
        )
    } else {
        return (
            <ChatUI roomId={currentRoom} prev={handleBackToXplore} />
        )
    }
}

function Xplore({ onXplore }) {
    return (
        <div id="discover">
            <button className="btn btn-main" title="search" onClick={onXplore}>
                <FaSearch className="icon"/> Xplore
            </button>
            <button className="btn btn-secondary" title="preferences">
                <FaToolbox className="icon"/> Preferences
            </button>
        </div>
    )
}
