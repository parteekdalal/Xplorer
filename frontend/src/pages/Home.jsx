import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { FaSearch, FaToolbox } from 'react-icons/fa';

import { Header } from '../components/basicComponents.jsx';
import ChatUI from '../components/chat.jsx';

export default function Home() {
    const [currentView, setCurrentView] = useState('xplorer'); // 'xplore' or 'chat'
    const [currentRoom, setCurrentRoom] = useState(null);

    const handleXplore = () => {
        // const discoverReq = {
        //     uid: localStorage.getItem("uid"),
        //     preferences: localStorage.getItem("preferences")
        // }
        // try {
        //     const response = await fetch("/api/discover", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(discoverReq)
        //     });
        // } catch (error) {
        //   console.error("error",error)  
        // };
        setCurrentRoom("r:1234");
        setCurrentView('chat');
    }

    const handleBackToXplore = () => {
        setCurrentView('xplorer');
        setCurrentRoom(null);
    };
    if (currentView === 'xplorer') {
        return (
            <div id="home-page">
                <Header />
                <h2 className="txt"><span className="txt-accent">Xplore</span> like-minded people</h2>
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
            <button className="btn btn-icon btn-main" title="search" onClick={onXplore}>
                <FaSearch className="icon"/> Discover
            </button>
            <button className="btn btn-icon" title="preferences">
                <FaToolbox className="icon"/> Preferences
            </button>
        </div>
    )
}
