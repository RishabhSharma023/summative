import "./SettingsView.css";
import { useState } from "react";
import { useStoreContext } from "../Contexts";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../firebase";

function SettingsView() {
    const { user, preferences, updatePreferences, purchases } = useStoreContext();
    const [firstName, setFirstName] = useState(user?.displayName?.split(" ")[0] || "");
    const [lastName, setLastName] = useState(user?.displayName?.split(" ")[1] || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [selectedGenres, setSelectedGenres] = useState(preferences?.selectedGenres || []);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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

    const isEmailUser = user?.providerData[0]?.providerId === 'password';

    function handleGenreChange(event) {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedGenres((prev) => [...prev, value]);
        } else {
            setSelectedGenres((prev) => prev.filter((genre) => genre !== value));
        }
    }

    async function handleSaveChanges(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (selectedGenres.length < 5) {
            setError("Please select at least 5 genres");
            return;
        }

        try {
            // Update genres
            await updatePreferences({ selectedGenres });
            
            if (isEmailUser) {
                // Update profile for email users
                if (firstName || lastName) {
                    await updateProfile(auth.currentUser, {
                        displayName: `${firstName} ${lastName}`.trim()
                    });
                }

                // Update password if provided
                if (currentPassword && newPassword) {
                    const credential = EmailAuthProvider.credential(
                        user.email,
                        currentPassword
                    );
                    await reauthenticateWithCredential(auth.currentUser, credential);
                    await updatePassword(auth.currentUser, newPassword);
                }
            }

            setMessage("Settings updated successfully!");
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                setError("Current password is incorrect");
            } else {
                setError("Failed to update settings");
            }
        }
    }

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            
            <form className="settings-form" onSubmit={handleSaveChanges}>
                <label className="settings-label">First Name:</label>
                <input
                    type="text"
                    className="settings-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEmailUser}
                />

                <label className="settings-label">Last Name:</label>
                <input
                    type="text"
                    className="settings-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEmailUser}
                />

                <label className="settings-label">Email:</label>
                <input
                    type="email"
                    className="settings-input"
                    value={user?.email || ""}
                    disabled
                />

                {isEmailUser && (
                    <>
                        <label className="settings-label">Current Password:</label>
                        <input
                            type="password"
                            className="settings-input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        <label className="settings-label">New Password:</label>
                        <input
                            type="password"
                            className="settings-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </>
                )}

                <label className="settings-label">Preferred Genres (at least 5):</label>
                <div className="genres-checkboxes">
                    {genres.map((genre) => (
                        <div key={genre.id} className="genre-checkbox">
                            <input
                                type="checkbox"
                                value={genre.name}
                                checked={selectedGenres.includes(genre.name)}
                                onChange={handleGenreChange}
                            />
                            <label>{genre.name}</label>
                        </div>
                    ))}
                </div>

                <button type="submit" className="settings-save-button">
                    Save Changes
                </button>
            </form>

            <div className="purchase-history">
                <h2>Purchase History</h2>
                {purchases && purchases.length > 0 ? (
                    <div className="purchases-grid">
                        {purchases.map((movie) => (
                            <div key={movie.id} className="purchase-item">
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                    className="purchase-poster"
                                />
                                <h3 className="purchase-title">{movie.title}</h3>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No purchases yet</p>
                )}
            </div>
        </div>
    );
}

export default SettingsView;