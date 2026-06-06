import { useState, useEffect, useRef, use } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

// icons 
import { IoMdNotifications } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { FaToolbox, FaCheckCircle } from "react-icons/fa";

// local import
import { OptionsMenu, NotificationsMenu } from "./Menus";

//global variables
const me = localStorage.getItem("username");

// elements
export function Header() {
    const [openMenu, setOpenMenu] = useState(null);
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Escape") { setOpenMenu(null);}
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => { document.removeEventListener('keydown', handleKeyPress); };
    }, [openMenu]);
    const menuMethods = {
        close: () => setOpenMenu(null)
    }
    return (
        <div id="page-header">
            <a href="/"><img src="/Xplorer-1.svg" alt="Logo" className="logo"/></a>
            <div className="header-right">
                <button className="btn-mini btn-icon" onClick={() => setOpenMenu(prev => prev != "notifications" ? "notifications" : null)}>
                    <IoMdNotifications />
                    </button>
                <button className="btn-mini btn-icon" onClick={() => setOpenMenu(prev => prev != "main" ? "main" : null)}>
                    <AiOutlineUser />
                </button>
                {(openMenu === "main") && <OptionsMenu methods={menuMethods} />}
                {(openMenu === "notifications") && <NotificationsMenu methods={menuMethods} />}
            </div>
        </div>
    )
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