import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMale, IoMdFemale, IoMdTransgender } from "react-icons/io";

import { Header, PopUp } from "../components/basicComponents.jsx";

export default function Auth() {
    const [newUser, setNewUser] = useState(true);
    return (
        <main id="auth">
            <Header />
            {newUser ? (
                <h2>Welcome to <span className="txt-accent">Xplorer</span></h2>
            ) : (
                <h2 className="txt-accent">Good to see you again</h2>
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
    const [popUp, setPopUp] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setLoginReq(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginReq)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setPopUp({
                    status: "error",
                    message: errorData.detail || "Login failed"
                });
                return;
            }

            const data = await response.json();
            setPopUp({ status: "success", message: "You're in."});
            localStorage.setItem("access_token", data.access_token);
            navigate("/");
        } catch (err) {
            setPopUp({
                status: "error",
                message: "Login failed: " + err.message
            });
        } finally {
            setIsLoading(false);
        }
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
                <button type="submit" className="btn btn-main" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Log in"}
                </button>
            </form>
            <button className="btn btn-secondary btn-big" onClick={() => handleUserState(true)}>
                New user?
            </button>
            {popUp && <PopUp status={popUp.status} message={popUp.message} handleOk={setPopUp}/>}
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
    const incrementStep = (func, inc) => { func(prev => prev+inc) };
    const [popUp, setPopUp] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    
    const genders = { 
        m: <IoMdMale style={{color: "#5555ff", "font-size":"30px"}}/>,
        f: <IoMdFemale style={{color: "#ff5599", "font-size":"30px"}}/>,
        o: <IoMdTransgender style={{color: "#44ff44", "font-size":"30px"}}/>
    };
    const genderKeys = Object.keys(genders);

    const cycleGender = () => {
        setSignupReq(prev => {
            const currentIndex = genderKeys.indexOf(prev.gender);
            const nextIndex = (currentIndex + 1) % genderKeys.length;
            return { ...prev, gender: genderKeys[nextIndex] };
        });
    };
    const handleNext = (e) => {
        e.preventDefault();
        setStep(s => s + 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignupReq(prev => ({
            ...prev,
            [name]: name === "birth_year" ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(signupReq)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setPopUp({ status: "error", message: errorData.detail || "Signup failed" });
                return;
            }
            const data = await response.json();
            setPopUp({ status: "success", message: "You're in" });
            localStorage.setItem("access_token", data.access_token);
            navigate("/");
        } catch (err) {
            setPopUp({ status: "error", message: "Signup failed: "+err || "Signup failed" });
        } finally {
            setIsLoading(false);
        }
    };
    if (step === 0){
        return (
            <div className="auth-page">
                <form className="auth-form" onSubmit={handleNext}>
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
                    <button className="btn btn-main" type="submit">Next</button>
                </form>
                <button className="btn btn-secondary" onClick={() => handleUserState(false)}>
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
                        <button className="btn btn-secondary" type="button" onClick={cycleGender}>
                            {signupReq.gender ? genders[signupReq.gender] : genders["m"]}
                        </button>
                    </div>
                    <textarea 
                        name="bio"
                        className="input" 
                        placeholder="bio (optional)" 
                        value={signupReq.bio}
                        onChange={handleInputChange}
                        maxLength="255"
                    />
                    <button type="submit" className="btn btn-main" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Sign Up"}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>
                </form>
                <button className="btn btn-secondary" onClick={() => {handleUserState(false)}}>
                    Existing user?
                </button>
                {popUp && <PopUp status={popUp.status} message={popUp.message} handleOk={setPopUp}/>}
            </div>
        ) 
    }
}