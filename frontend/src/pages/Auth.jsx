import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdMale, IoMdFemale, IoMdTransgender } from "react-icons/io";

import { Header } from "../components/basicComponents.jsx";
import { explainError } from "../utils/utils.js";
import { postAuth } from "../utils/auth.js";

const BACKEND = import.meta.env.VITE_API;

export default function Auth() {
    const { method = "signup" } = useParams();
    const [newUser, setNewUser] = useState(method === "signup");
    return (
        <main id="auth">
            <Header />
            {newUser ? (
                <h2 className="txt headline">Welcome to Xplorer</h2>
            ) : (
                <h2 className="txt headline">Good to see you again</h2>
            )
            }
            {newUser ? (
                <SignUp handleUserState={setNewUser}/>
                ) : (
                <Login  handleUserState={setNewUser}/>)
            }
        </main>
    )
}

function Login({ handleUserState }) {
    const [loginReq, setLoginReq] = useState({
        key: "", 
        password: ""
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginReq(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await postAuth("login", loginReq);
        setIsLoading(false);
        response && navigate("/");
        
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit} className="auth-form">
                <input 
                    type="text" 
                    name="key"
                    className="input" 
                    placeholder="username" 
                    value={loginReq.key}
                    onChange={handleInputChange}
                    required
                />
                <input 
                    type="password" 
                    name="password"
                    className="input" 
                    placeholder="password" 
                    value={loginReq.password}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Log in"}
                </button>
            </form>
            <button className="btn btn-tertiary" onClick={() => handleUserState(true)}>
                New user?
            </button>
        </div>
    )
}

function SignUp({ handleUserState }) {
    const [signupReq, setSignupReq] = useState({
        username: "",
        email: "",
        password: "",
        birth_year: new Date().getFullYear() - 18,
        gender: "m",
        display_name: "",
        bio: "",
        interests: [],
        languages: []
    });
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const genders = { 
        m: <IoMdMale style={{color: "#5555ff"}}/>,
        f: <IoMdFemale style={{color: "#ff5599"}}/>,
        o: <IoMdTransgender style={{color: "#44ff44"}}/>
    };
    const genderKeys = Object.keys(genders);

    const cycleGender = () => {
        setSignupReq(prev => {
            const currentIndex = genderKeys.indexOf(prev.gender);
            const nextIndex = (currentIndex + 1) % genderKeys.length;
            return { ...prev, gender: genderKeys[nextIndex] };
        });
    };

    const [usernameStatus, setUsernameStatus] = useState({
        available: null,
        checking: false,
        error: null
    });

    const handleNext = (e) => {
        e.preventDefault();
        setStep(s => s + 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignupReq(prev => ({
            ...prev,
            [name]: name === "birth_year" ? parseInt(value) : name === "username" ? value.toLowerCase() : value
        }));
    };

    const abortRef = useRef(null);

    useEffect(() => {
        const username = signupReq.username.trim();
        if (!username || username.length < 3) {
            setUsernameStatus({ available: null, checking: false, error: null });
            return;
        }
        setUsernameStatus({ available: null, checking: true, error: null });

        const timer = setTimeout(async () => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            try {
                const response = await axios.get(
                    `http://${BACKEND}/auth/username_availability/${encodeURIComponent(username)}`,
                    { signal: abortRef.current.signal }
                );
                setUsernameStatus({
                    available: response.data?.availability,
                    checking: false,
                    error: null
                });
            } catch (err) {
                if (axios.isCancel(err)) return;
                setUsernameStatus({
                    available: null,
                    checking: false,
                    error: "Couldn't check username."
                });
                console.warn(`error checking for username ${username}`, err);
            }
        }, 400);

    return () => {
        clearTimeout(timer);
        abortRef.current?.abort();
    };
}, [signupReq.username]);

    const usernameMessage = usernameStatus.checking
        ? (<p>Checking availability...</p>)
        : usernameStatus.error
            ? (<p className="txt-warn">{usernameStatus.error}</p>)
            : usernameStatus.available === true
                ? (<p className="txt-success">{signupReq.username} is available.</p>)
                : usernameStatus.available === false
                    ? (<p className="txt-error">{signupReq.username} is not available.</p>)
                    : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await postAuth("signup", signupReq);
        setIsLoading(false);
        response && navigate("/");
    };
    if (step === 0){
        return (
            <div className="auth-page">
                <form className="auth-form" onSubmit={handleNext}>
                    {usernameMessage && usernameMessage}
                    <input 
                        type="text" 
                        name="username"
                        className="input" 
                        placeholder="username" 
                        value={signupReq.username}
                        onChange={handleInputChange}
                        minLength="3"
                        maxLength="50"
                        required
                    />
                    <input 
                        type="email" 
                        name="email"
                        className="input" 
                        placeholder="email" 
                        value={signupReq.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input 
                        type="password" 
                        name="password"
                        className="input" 
                        placeholder="password" 
                        value={signupReq.password}
                        onChange={handleInputChange}
                        minLength="8"
                        required
                    />
                    <button className="btn btn-primary" type="submit" disabled={usernameStatus.available === false || signupReq.username.trim().length < 3}>
                        Next
                    </button>
                </form>
                <button className="btn btn-tertiary" onClick={() => handleUserState(false)}>
                    Existing user?
                </button>
            </div>
        )
    } else {
        return  (
            <div className="auth-page">
                <form onSubmit={handleSubmit} className="auth-form">
                    <input 
                        type="text" 
                        name="display_name"
                        className="input" 
                        placeholder="display name (optional)" 
                        value={signupReq.display_name}
                        onChange={handleInputChange}
                        maxLength="50"
                    />
                    <div className="container">
                        <input
                            type="number" 
                            name="birth_year"
                            className="input" 
                            placeholder="birth year" 
                            value={signupReq.birth_year}
                            onChange={handleInputChange}
                            min="1900"
                            max={new Date().getFullYear()}
                            required
                        />
                        <button className="gender-btn btn-secondary" type="button" onClick={cycleGender}>
                            {signupReq.gender ? genders[signupReq.gender] : genders.m}
                        </button>
                    </div>
                    <textarea 
                        name="bio"
                        className="input textbox" 
                        placeholder="bio (optional)" 
                        value={signupReq.bio}
                        onChange={handleInputChange}
                        maxLength="255"
                    />
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Sign Up"}
                    </button>
                    <button className="btn btn-tertiary" onClick={() => setStep(s => s - 1)}>Back</button>
                </form>
                <button className="btn btn-secondary" onClick={() => {handleUserState(false)}}>
                    Existing user?
                </button>
            </div>
        ) 
    }
}