import { useState, useEffect, useRef, use } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { IoMdNotifications, IoIosWarning } from "react-icons/io";
import { IoExit } from "react-icons/io5";
import { AiOutlineUser, AiFillSetting } from "react-icons/ai";
import { FaToolbox, FaCheckCircle } from "react-icons/fa";

const me = localStorage.getItem("username");

export function Header() {
    const [openMenu, setOpenMenu] = useState(null);
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Escape") { setOpenMenu(null);}
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => { document.removeEventListener('keydown', handleKeyPress); };
    }, [openMenu]);

    return (
        <div id="header">
            <a href="/"><img src="/Xplorer-1.svg" alt="Logo" className="logo"/></a>
            <div className="header-right">
                <button className="btn-mini btn-icon" onClick={() => setOpenMenu(prev => prev != "notifications" ? "notifications" : null)}>
                    <IoMdNotifications />
                    </button>
                <button className="btn-mini btn-icon" onClick={() => setOpenMenu(prev => prev != "main" ? "main" : null)}>
                    <AiOutlineUser />
                </button>
                {(openMenu === "main") && <Menu />}
                {(openMenu === "notifications") && <Notifications />}
            </div>
        </div>
    )
}

export function Loading() {
    return (
        <div className="loading-container">
            <div className="spinner spinner1"></div>
            <div className="spinner spinner2"></div>
        </div>
    )
}

export function Menu() {
    const navigate = useNavigate();
    return (
        <>
            <div className="menu menu-tr">
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
            </div>
            { createPortal(<div className="menu-overlay" />, document.body ) }
        </>
    )
}

export function Notifications() {
    const [notifications, setNotifications] = useState([])
    
    if (notifications.length === 0) {
        return (
            <>
                <div className="menu menu-tr">
                    <h5 className="txt-secondary">Notifications will appear here...</h5>
                </div>
                { createPortal(<div className="menu-overlay" />, document.body ) }
            </>
        )
    } else {
        return (
            <div className="menu notifications-menu">
            </div>
        )
    }
}

export function PopUp({ status, message, handleOk, secondOption, handleSecondOption }) {
    return (
        <div className={`popup ${status}`}>
            <div className="popup-header">
                {status === "success" ? (
                    <FaCheckCircle className="icon"/>
                    ) : (
                    <IoIosWarning className="icon"/>)
                }
                <h2>{status}</h2>
            </div>
            <div className="popup-body">
                <p>{message}</p>
            </div>
            <div className="popup-options">
                <button className="btn" onClick={() => {handleOk(null)}}>OK</button>
                {secondOption && <button className="btn" onClick={handleSecondOption}>{secondOption}</button>}
            </div>
        </div>
    )
}