import { getToken } from "../utils/auth.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const BACKEND = import.meta.env.VITE_API;
const token = getToken();

// Xplore Methods
export async function handleXplore(setStatus, navigate) {
    setStatus("searching");
    const xploreReq = {
        username: localStorage.getItem("username"),
        preferred_gender: localStorage.getItem("preferred_gender") || "a"
    }
    try {
        const response = await axios.post(`http://${BACKEND}/user/xplore`, xploreReq);
        const data = response.data;
        if (data.status === false) {
            toast.error(data.message);
            console.warn(data.message);
            return;
        }
        sessionStorage.setItem("ws_url", `ws://${BACKEND}/chat/${data.room_id}?token=${token}`);
        navigate(`/chat/${data.room_id}`);
    } catch (err) {
        console.error("error",err);
    } finally { setStatus(""); };
}


// Public Rooms Methods
export async function getRooms(setRooms) {
    try {
        const response = await axios.get(`http://${BACKEND}/public/rooms`);
        setRooms(response.data);
        console.log('fetched public rooms.')
    } catch (err) {
        console.error(err);
        toast.error(err.message);
    }
};