import "./LoginView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginView() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const adminEmail = "rishabh@gmail.com";
    const adminPassword = "password";

    function handleSubmit(event) {
        event.preventDefault();
        if (email === adminEmail && password === adminPassword) {
            localStorage.setItem("isLoggedIn", "true");
            alert("Login successful!");
            navigate("/movies");
        } else {
            alert("Incorrect email or password.");
        }
    }

    return (
        <div className="formContainerLog">
            <h1 className="headerLog">Amazin' Prime Video</h1>
            <h2 className="formTitleLog">Login</h2>
            <form className="formLog" onSubmit={handleSubmit}>
                <label className="boxLabelsLog">Email:</label>
                <input
                    required
                    className="infoBoxesLog"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <label className="boxLabelsLog">Password:</label>
                <input
                    required
                    className="infoBoxesLog"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <input className="loginButtonLog" type="submit" value="Login" />
            </form>
        </div>
    );
}

export default LoginView;
