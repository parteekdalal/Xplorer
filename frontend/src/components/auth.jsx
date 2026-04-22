function Login() {
    return (
        <div className="dialog">
            <input type="text" className="input" placeholder="username" required/>
            <input type="password" className="input" placeholder="password" required/>

            <button className="btn btn-accent">Continue</button>
        </div>
    )
}