import "./SettingsView.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Contexts";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../firebase";

function SettingsView() {
    const navigate = useNavigate();
    const { user, preferences, updatePreferences, purchases } = useStoreContext();
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [selectedGenres, setSelectedGenres] = useState(preferences?.selectedGenres || []);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Update form fields when user data changes
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setSelectedGenres(user.selectedGenres || []);
        }
    }, [user]);

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
    }    async function handleSaveChanges(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        try {
            // Validate genre selection
            if (selectedGenres.length < 5) {
                setError("Please select at least 5 genres");
                return;
            }

            // If email user is updating name/password
            if (isEmailUser) {
                if (firstName || lastName) {
                    const newDisplayName = `${firstName} ${lastName}`.trim();
                    if (newDisplayName !== user.displayName) {
                        await updateProfile(auth.currentUser, {
                            displayName: newDisplayName
                        });
                    }
                }

                if (currentPassword && newPassword) {
                    if (newPassword.length < 6) {
                        setError("New password must be at least 6 characters long");
                        return;
                    }

                    try {
                        const credential = EmailAuthProvider.credential(
                            user.email,
                            currentPassword
                        );
                        await reauthenticateWithCredential(auth.currentUser, credential);
                        await updatePassword(auth.currentUser, newPassword);
                        
                        // Update password length in preferences
                        await updatePreferences({
                            selectedGenres,
                            firstName: firstName || user.firstName,
                            lastName: lastName || user.lastName,
                            passwordLength: newPassword.length // Add the new password length
                        });
                    } catch (passwordError) {
                        if (passwordError.code === 'auth/wrong-password') {
                            setError("Current password is incorrect");
                            return;
                        }
                        throw passwordError;
                    }
                } else {
                    // Update preferences without changing password length
                    await updatePreferences({
                        selectedGenres,
                        firstName: firstName || user.firstName,
                        lastName: lastName || user.lastName
                    });
                }
            } else {
                // For non-email users, just update preferences
                await updatePreferences({
                    selectedGenres,
                    firstName: firstName || user.firstName,
                    lastName: lastName || user.lastName
                });
            }

            // Clear password fields
            setCurrentPassword("");
            setNewPassword("");
            
            // Show success message
            setMessage("Settings updated successfully!");
            
            // Auto-hide success message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Settings update error:", error);
            setError(error.message || "Failed to update settings. Please try again.");
        }
    }

    // Add notification message if no genres are selected
    const showGenreWarning = user && (!user.selectedGenres || user.selectedGenres.length === 0);

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            {showGenreWarning && (
                <p className="warning-message">
                    Please select at least 5 genres to continue browsing movies.
                </p>
            )}
            
            <button className="back-button" onClick={() => {
                // Only allow going back to movies if genres are selected
                if (user?.selectedGenres?.length > 0) {
                    navigate('/movies');
                } else {
                    setError("Please select at least 5 genres first");
                }
            }}>
                Back to Movies
            </button>

            <form className="settings-form" onSubmit={handleSaveChanges}>
                <label className="settings-label">First Name:</label>
                <input
                    type="text"
                    className="settings-input"
                    value={firstName}
                    disabled={true}
                    readOnly
                />

                <label className="settings-label">Last Name:</label>
                <input
                    type="text"
                    className="settings-input"
                    value={lastName}
                    disabled={true}
                    readOnly
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
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        <label className="settings-label">New Password:</label>
                        <input
                            type="password"
                            className="settings-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
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