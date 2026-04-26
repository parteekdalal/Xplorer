import { useState } from "react";
import { Header } from "../components/basicComponents.jsx";
import { IoMdMale, IoMdFemale, IoMdTransgender } from "react-icons/io";

export default function Auth() {
    const [newUser, setNewUser] = useState(true);
    const [popup, setPopup] = useState(null);
    return (
        <main id="auth-page">
            <Header />
            {newUser ? (
                <h2 className="txt-accent">Welcome to WanderHead</h2>
            ) : (
                <h2 className="txt-accent">Good to see you again</h2>
            )
            }
            {newUser ? (
                <SignUp handleUserState={setNewUser}/>
                ) : (
                <Login  handleUserState={setNewUser}/>)
            }
            {/* {popup && <PopUp status={popup.status} message={popup.message}/>} */}
        </main>
    )
}

function Login({ handleUserState }) {
    const [loginReq, setLoginReq] = useState({
        key: "", 
        password: "", 
        login_by_email: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginReq(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
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
                setError(errorData.detail || "Login failed");
                return;
            }

            const data = await response.json();
            console.log("Login successful:", data);
            // Handle successful login (store token, redirect, etc.)
        } catch (err) {
            setError("Failed to connect to server: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="auth-page" className="dialog">
            <form onSubmit={handleSubmit} className="form">
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
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input 
                        type="checkbox" 
                        name="login_by_email"
                        checked={loginReq.login_by_email}
                        onChange={handleInputChange}
                    />
                    Login with email
                </label>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" className="btn btn-accent" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Continue"}
                </button>
            </form>
            <button className="btn btn-secondary" onClick={() => handleUserState(true)}>
                new user
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
        gender: "",
        display_name: "",
        bio: "",
        interests: [],
        languages: []
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const genders = { 
        m: [ "m", <IoMdMale />],
        f: [ "f", <IoMdFemale />],
        o: [ "0", <IoMdTransgender />]
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
        setError("");
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
                setError(errorData.detail || "Signup failed");
                return;
            }

            const data = await response.json();
            console.log("Signup successful:", data);
            // Handle successful signup (redirect to login, etc.)
        } catch (err) {
            setError("Failed to connect to server: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="auth-page" className="dialog">
            <form onSubmit={handleSubmit} className="form">
                <input 
                    type="text" 
                    name="username"
                    className="input" 
                    placeholder="username" 
                    value={signupReq.username}
                    onChange={handleInputChange}
                    minLength="1"
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
                <input 
                    type="text" 
                    name="display_name"
                    className="input" 
                    placeholder="display name (optional)" 
                    value={signupReq.display_name}
                    onChange={handleInputChange}
                    maxLength="50"
                />
                <textarea 
                    name="bio"
                    className="input" 
                    placeholder="bio (optional)" 
                    value={signupReq.bio}
                    onChange={handleInputChange}
                    maxLength="255"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" className="btn btn-main" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Create Account"}
                </button>
            </form>
            <button className="btn btn-secondary" onClick={() => handleUserState(false)}>
                existing user
            </button>
        </div>
    )
}