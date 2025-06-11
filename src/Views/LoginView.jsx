import "./LoginView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import Header from "../Components/Header.jsx";

function LoginView() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleEmailLogin(event) {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/movies");
        } catch (error) {
            setError("Invalid email or password");
        }
    }

    async function handleGoogleLogin() {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/movies");
        } catch (error) {
            setError("Could not sign in with Google");
        }
    }

    return (
        <div>
            <Header />
            <div className="formContainerLog">
                <h1 className="headerLog">Amazin' Prime Video</h1>
                <h2 className="formTitleLog">Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form className="formLog" onSubmit={handleEmailLogin}>
                    <label className="boxLabelsLog">Email:</label>
                    <input
                        required
                        className="infoBoxesLog"
                        type="email"
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
                <button className="googleButton" onClick={handleGoogleLogin}>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

export default LoginView;
