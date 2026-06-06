import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

// icons
import { IoExit } from "react-icons/io5";
import { AiOutlineUser, AiFillSetting } from "react-icons/ai";
import { FaToolbox } from "react-icons/fa";

const me = localStorage.getItem("username");

export function Menu({methods, children}) {
    return (
        <>
            <div className="menu menu-tr">
            {children}
            </div>
            { createPortal(<div className="overlay" onClick={methods.close} />, document.body ) }
        </>
    )
}

export function OptionsMenu({ methods }) {
    const navigate = useNavigate();
    return (
        <Menu methods={methods}>
            <section className="menu-section">
                { me ? <button className="btn" onClick={() => {navigate(`/profile/${me}`)}}>
                    <AiOutlineUser /> Me
                </button> : <button className="btn" onClick={() => {navigate("/auth")}}>
                    <AiOutlineUser /> Join Explorer
                </button>}
                
                <button className="btn">
                    <FaToolbox /> Preferences
                </button>
            </section>

            <section className="menu-section">
                <button className="btn">
                    <AiFillSetting /> Settings
                </button>
            </section>
        </Menu>
    )
}

export function NotificationsMenu({ methods }) {
    const [notifications, setNotifications] = useState([]);
    
    if (notifications.length === 0) {
        return (
            <Menu methods={methods}>
                <h5 className="txt-secondary">Notifications will appear here...</h5>
            </Menu>
        )
    } else {
        /* haven't worked on notifications yet */
        return (
            <Menu>

            </Menu>
        )
    }
}