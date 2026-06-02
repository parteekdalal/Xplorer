import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createPortal } from "react-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import { IoMdMale, IoMdFemale, IoMdTransgender } from "react-icons/io";


import { Header } from "./basicComponents";

const BACKEND = import.meta.env.VITE_API;

export function ProfileMini({ username, handleExit }) {
    const [userInfo, setUserInfo] = useState(null);
    const genders = {
        m: <IoMdMale style={{color: "#5555ff"}}/>,
        f: <IoMdFemale style={{color: "#ff5599"}}/>,
        o: <IoMdTransgender style={{color: "#44ff44"}}/>
    };
    const fetchUser = async () => {
        try {
    
            const response = await axios.get(`http://${BACKEND}/user/${username}`);
            setUserInfo(response.data.data);
            console.log(`profile data fetched for: ${username}`);
        } catch (err) {
            console.error(err.message);
            toast.error(err.message);
        }
    };

    useEffect(() => { fetchUser(); }, [username]);

    return (
        <>
        <div id="profile-mini">
            <div id="profile-header">
                {/* <img src="/Xplorer.png" alt="profile pic" className='pfp'/> */}
                <div className="txt-span header-section container-v">
                    <h1 className='txt-secondary'>{userInfo?.display_name || "No Name"}</h1>
                    <div className='container-h'>
                        <p className='txt-muted'>@{username} {userInfo?.age} {genders[userInfo?.gender]}</p>
                    </div>
                </div>
                <div id="details" className="header-section container-v">
                    <div className="container-h">
                        {userInfo?.interests.map((pref, key) => 
                            (<p key={key} className='tag txt-span'>{pref}</p>)
                            ) || <p className='txt-span'>no interests</p>}
                    </div>
                    <div id='langs' className="container-h" >
                        {userInfo?.languages.map((lang, key) => 
                            (<p key={key} className='tag txt-span'>{lang}</p>)
                        ) || <p className='txt'>no interests</p>}
                    </div>
                </div>
            </div>
            <div id="profile-body" className="container-v">
                <p className=''>{userInfo?.bio || "no bio"}</p>
                <h4 className='txt-secondary'> BIO</h4>
            </div>
        </div>
        { createPortal(<div className="overlay" onClick={handleExit} />, document.body ) }
        </>
    )
}