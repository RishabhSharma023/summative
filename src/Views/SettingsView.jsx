import "./SettingsView.css";
import { useContext, useState } from "react";
import { UserContext } from "../Contexts/UserContext.jsx";

function SettingsView() {
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [selectedGenres, setSelectedGenres] = useState(user?.selectedGenres || []);

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

    function handleSaveChanges(event) {
        event.preventDefault();

        if (selectedGenres.length < 5) {
            alert("Please select at least 5 genres.");
            return;
        }

        const updatedUser = {
            ...user,
            firstName,
            lastName,
            selectedGenres,
        };

        setUser(updatedUser);
        alert("Settings updated successfully!");
    }

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>
            <form className="settings-form" onSubmit={handleSaveChanges}>
                <label className="settings-label">First Name:</label>
                <input
                    type="text"
                    className="settings-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <label className="settings-label">Last Name:</label>
                <input
                    type="text"
                    className="settings-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <label className="settings-label">Email:</label>
                <input
                    type="email"
                    className="settings-input"
                    value={user?.email || ""}
                    disabled
                />

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
        </div>
    );
}

export default SettingsView;