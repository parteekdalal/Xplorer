import { useState, useEffect } from "react";
import { ProfileMini } from "./Profile";

export default function Sidebar({ members, type = "basic" }) {
    const visOptions = ["basic", "public", "private"]
    
    if (type === "basic") {
        return (
            <div className="chat-sbar">
                <ActiveMembers members={members}/>
            </div>
        )
    } else if (type === "public") {
        return (
            <div className="chat-sbar">
                <Header />
                <ActiveMembers members={members}/>
            </div>
        )
    }
}

function Header() {
    return (
        <div className="section container-v">
            <div className="background" />
            <h3 id="title" className="txt-secondary">Room title</h3>
            <div id="body" className="txt-span">
                <p id="description">Sidebar sections are under development...</p>
            </div>
        </div>
    )
}

function ActiveMembers({ members }) {
    const [openProfile, setOpenProfile] = useState(null);
    useState(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Backspace") setOpenProfile(null)
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => { document.removeEventListener('keydown', handleKeyPress); };
    }, [openProfile]);
    return (
        <div id="active-members" className="section container-v">
            <div className="background" />
            <h3 id="title">in the room</h3>
            <p id="info-bubble">{members?.length || 0}</p>
            <div className="container-v">
                {members.map((member, key) => (
                    <div key={key} onClick={() => setOpenProfile(member)} className="member">
                        {member}
                        {openProfile === member && <ProfileMini username={openProfile} handleExit={() => setOpenProfile(null)} />}
                    </div>
                ))}
            </div>
        </div>
    )
}

function Options() {
    return (
        <div className="section container-v">
            <div className="background" />
            {/* action buttons */}
        </div>
    )
}