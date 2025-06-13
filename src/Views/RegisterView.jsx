import "./RegisterView.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import Header from "../Components/Header.jsx";
import { useStoreContext } from "../Contexts";

function RegisterView() {
    const navigate = useNavigate();
    const { user } = useStoreContext();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [error, setError] = useState("");

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/movies');
        }
    }, [user, navigate]);

    const genres = [
        { name: "Action", id: 28 },
        { name: "Adventure", id: 12 },
        { name: "Animation", id: 16 },
        { name: "Comedy", id: 35 },
        { name: "Family", id: 10751 },
        { name: "Fantasy", id: 14 },
        { name: "History", id: 36 },
        { name: "Horror", id: 27 },
        { name: "Sci-Fi", id: 878 },
        { name: "Thriller", id: 53 },
    ];

    function handleGenreChange(event) {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedGenres((prev) => [...prev, value]);
        } else {
            setSelectedGenres((prev) => prev.filter((genre) => genre !== value));
        }
    }

    async function handleEmailRegister(event) {
        event.preventDefault();

        if (password !== rePassword) {
            setError("Passwords do not match");
            return;
        }

        if (selectedGenres.length < 5) {
            setError("Please select at least 5 genres");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user data in Firestore            
            await setDoc(doc(firestore, "users", user.uid), {
                firstName,
                lastName,
                email,
                selectedGenres,
                purchases: [],
                authProvider: "email",
                passwordLength: password.length // Store password length
            });

            navigate("/movies");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("Account already exists. Redirecting to login...");
                navigate("/login");
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    }

    async function handleGoogleRegister() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            // Check if the user already exists in Firestore
            const userRef = doc(firestore, "users", result.user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                // User already exists, sign them out and redirect to login
                await auth.signOut();
                alert("Account already exists. Redirecting to login...");
                navigate("/login");
                return;
            }

            // This is a new user, create their account
            await setDoc(userRef, {
                firstName: result.user.displayName?.split(" ")[0] || "",
                lastName: result.user.displayName?.split(" ")[1] || "",
                email: result.user.email,
                selectedGenres: [],
                purchases: [],
                authProvider: "google"
            });
            
            localStorage.setItem("isLoggedIn", "true");
            navigate("/settings"); // Send to settings to select genres
        } catch (error) {
            console.error("Google registration error:", error);
            if (error.code === "auth/popup-closed-by-user") {
                setError("Sign-in popup was closed");
            } else {
                setError("Could not register with Google. Please try again.");
            }
        }
    }

    return (
        <div>
            <Header />
            <div className="formContainerReg">
                <h1 className="formTitleReg">Register</h1>
                {error && <p className="error-message">{error}</p>}
                <form className="formReg" onSubmit={handleEmailRegister}>
                    <label className="boxLabelsReg">First Name:</label>
                    <input
                        required
                        className="infoBoxesReg"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                    />
                    <label className="boxLabelsReg">Last Name:</label>
                    <input
                        required
                        className="infoBoxesReg"
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                    <label className="boxLabelsReg">Email:</label>
                    <input
                        required
                        className="infoBoxesReg"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <label className="boxLabelsReg">Password:</label>
                    <input
                        required
                        className="infoBoxesReg"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <label className="boxLabelsReg">Re-enter Password:</label>
                    <input
                        required
                        className="infoBoxesReg"
                        type="password"
                        value={rePassword}
                        onChange={(event) => setRePassword(event.target.value)}
                    />
                    <label className="boxLabelsReg">Select Genres (at least 5):</label>
                    <div className="genres-checkboxes">
                        {genres.map((genre) => (
                            <div key={genre.id} className="genre-checkbox">
                                <input
                                    type="checkbox"
                                    value={genre.name}
                                    onChange={handleGenreChange}
                                />
                                <label>{genre.name}</label>
                            </div>
                        ))}
                    </div>
                    <input
                        className="registerButtonReg"
                        type="submit"
                        value="Register"
                    />
                </form>
                <button className="googleButton" onClick={handleGoogleRegister}>
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

export default RegisterView;