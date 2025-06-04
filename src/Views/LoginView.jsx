import "./LoginView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/index.js";

function LoginView() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleEmailLogin(event) {
        event.preventDefault();

        try {
            // Check if the user exists in Firestore
            const userDoc = await getDoc(doc(firestore, "users", email));
            if (!userDoc.exists()) {
                setError("Email not registered. Please register first.");
                return;
            }

            // Authenticate the user with Firebase Authentication
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
            navigate("/movies");
        } catch (error) {
            console.error("Error logging in:", error.message);
            setError("Incorrect email or password.");
        }
    }

    async function handleGoogleLogin() {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            // Check if the user exists in Firestore
            const userDoc = await getDoc(doc(firestore, "users", user.email));
            if (!userDoc.exists()) {
                setError("Google account not registered. Please register first.");
                return;
            }

            alert("Login successful!");
            navigate("/movies");
        } catch (error) {
            console.error("Error logging in with Google:", error.message);
            setError("Failed to log in with Google.");
        }
    }

    return (
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
                <button className="loginButtonLog" type="submit">
                    Login with Email
                </button>
            </form>
            <button className="loginButtonLog" onClick={handleGoogleLogin}>
                Login with Google
            </button>
        </div>
    );
}

export default LoginView;