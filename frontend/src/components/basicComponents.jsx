import { useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";

export function Header() {
    return (
        <div id="header">
            <a href="/"><img src="/logo.png" alt="Logo" className="logo"/></a>
            <div className="header-right">
                <button className="btn-mini btn-icon">
                    <IoMdNotifications />
                </button>
                <button className="btn-mini btn-icon">
                    <AiOutlineUser />
                </button>
            </div>
        </div>
    )
}

export function Footer() {
    return (
        <div id="footer">
            <p>this is the footer</p>
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