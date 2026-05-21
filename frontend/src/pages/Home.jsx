import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';

import { FaSearch, FaToolbox, FaPlus } from 'react-icons/fa';
import { IoEnter } from "react-icons/io5";

import { Header } from '../components/basicComponents.jsx';
import ChatUI from '../components/chat.jsx';

import { getToken } from "../utils/auth.js";
import { handleXplore, getRooms } from "../utils/home.js";

const BACKEND = import.meta.env.VITE_API;

export default function Home() {
    const token = getToken();
    const navigate = useNavigate();
    if (token) {
        return (
            <main id="home-page">
                <Header />
                <h2 className="txt headline">Find people like you...</h2>
                <Xplore />
                <PublicRooms token={token}/>
            </main>
        )
    } else { 
        return (
            <div id="home-page">
                <Header />
                <h2 className="txt headline">Find people like you...</h2>
                <Welcome />
            </div>
        )
    }
}

function Welcome() {
    const navigate = useNavigate();
    return (
        <div id="xplore">
            <button className="btn btn-main" onClick={() => { navigate("/auth/login"); }}>
                Log in
            </button>
            <button className="btn btn-secondary" onClick={() => { navigate("/auth/signup"); }}>
                I'm new
            </button>
        </div>
    )
}

function Xplore() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState("");
    return (
        <div id="xplore">
            <button className="btn btn-primary" onClick={() => { handleXplore(setLoading, navigate); }}>
                <FaSearch className={`icon ${loading}`}/> {loading || "Xplore"}
            </button>
            <button className="btn btn-tertiary" title="preferences">
                <FaToolbox className="icon"/> Preferences
            </button>
        </div>
    )
}

function PublicRooms({ token }) {
    const [rooms, setRooms] = useState(null);

    const navigate = useNavigate();
    const createRoom = () => {
        const roomId = Math.floor(Math.random() * 90000) + 10000;
        sessionStorage.setItem("ws_url", `ws://${BACKEND}/public/${roomId}?token=${token}`);
        navigate(`/chat/${roomId}`);
    };
    useEffect(() => { getRooms(setRooms); }, []);
    return (
        <div id="public-rooms">
            <div className="header">
                <h2 className="txt">Public Rooms</h2>
                <h5 className="txt-span members">{rooms?.length} active</h5>
                <div className="container options">
                    <button className="btn-mini" ><FaSearch /></button>
                    <button className="btn-mini" onClick={createRoom}><FaPlus /></button>
                </div>
            </div>
            {rooms?.map(room => (<RoomCard key={room.room_id} roomInfo={room} token={token}/>))}
        </div>
    )
}
function RoomCard({ roomInfo, token}){
    const navigate = useNavigate();
    const handleJoin = () => {
        sessionStorage.setItem("ws_url", `ws://${BACKEND}/public/${roomInfo.room_id}?token=${token}`);
        navigate(`/chat/${roomInfo.room_id}`);
    };
    return (
        <div className="room">
            <div className="container">
                <h4>{roomInfo.room_id}</h4>
                <h5 className="txt-span members">{roomInfo?.members || 0} active</h5>
            </div>
            <button className="btn-mini" onClick={handleJoin} title="Join"><IoEnter className="icon" /></button>
        </div>
    )
}

