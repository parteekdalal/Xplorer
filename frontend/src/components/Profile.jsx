import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoMdMale, IoMdFemale, IoMdTransgender } from "react-icons/io";
import axios from 'axios';

import { Header } from "./basicComponents";

export function ProfileMini() {
    const { username } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const genders = { 
        m: <IoMdMale style={{color: "#5555ff"}}/>,
        f: <IoMdFemale style={{color: "#ff5599"}}/>,
        o: <IoMdTransgender style={{color: "#44ff44"}}/>
    };
    const fetchUser = async () => {
        try {
            const response = await axios.get(`/api/user/${username}`);
            setUserInfo(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchUser(); }, [username]);

    return (
        <div id="profile-page">
            <div id="profile-header">
                <img src="/demopfp.webp" alt="couldn't load profile pic" className='pfp'/>
                <div className="profile-card">
                    <h1 className='txt-secondary'>{userInfo?.display_name || "Display Name"}</h1>
                    <div className='profile-container'>
                    <h4 className='txt profile-span'>@{username}</h4>
                    <h4 className='txt '> {userInfo?.age || "age"} {genders[userInfo?.gender]}</h4>
                    </div>
                </div>
            </div>
            <div id="profile-body">
                <div id='bio' className="profile-card" >
                    <p className='txt'>{userInfo?.bio || "no bio"}</p>
                </div>
                <div id='prefs' className="profile-card" >
                    {userInfo?.interests.map(pref => 
                        <p className='txt profile-span'>{pref}</p>
                    ) || <p className='txt'>no interests</p>}
                </div>
                <div id='langs' className="profile-card" >
                    {userInfo?.languages.map(lang => 
                        <p className='txt profile-span'>{lang}</p>
                    ) || <p className='txt'>no interests</p>}
                </div>
                <h4 id='tbio' className='txt-secondary profile-span'>BIO</h4>
                <h4 id='tprefs' className='txt-secondary profile-span'>INTERESTS</h4>
                <h4 id='tlangs' className='txt-secondary profile-span'>LANGUAGES</h4>
            </div>

        </div>
    )
}