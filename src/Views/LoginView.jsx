import "./LoginView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import Header from "../Components/Header.jsx";

function LoginView() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");    async function handleEmailLogin(event) {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem("isLoggedIn", "true");
            navigate("/movies");
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setError("This email is not registered. Please register first.");
            } else if (error.code === 'auth/wrong-password') {
                setError("Incorrect password. Please try again.");
            } else if (error.code === 'auth/invalid-email') {
                setError("Invalid email format. Please check your email.");
            } else if (error.code === 'auth/too-many-requests') {
                setError("Too many failed attempts. Please try again later.");
            } else {
                setError("Login failed. Please try again.");
            }
            console.error("Login error:", error.code);
        }
    }    async function handleGoogleLogin() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const userDoc = await getDoc(doc(firestore, "users", result.user.uid));
            
            if (!userDoc.exists()) {
                // User hasn't registered yet
                setError("Please register first to use Google sign-in");
                navigate("/register");
                return;
            }
            
            // Existing user - go to movies if they have genres, otherwise to settings
            const userData = userDoc.data();
            localStorage.setItem("isLoggedIn", "true");
            navigate(userData.selectedGenres?.length > 0 ? "/movies" : "/settings");
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                setError("Login cancelled. Please try again.");
            } else {
                setError("Could not sign in with Google. Please try again.");
                console.error("Google login error:", error);
            }
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
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

export default LoginView;
