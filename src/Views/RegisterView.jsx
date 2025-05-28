import "./RegisterView.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header.jsx";
import { UserContext } from "../Contexts/UserContext.jsx";

function RegisterView() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);

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

    function handleSubmit(event) {
        event.preventDefault();

        if (!firstName || !lastName || !email || !password || !rePassword) {
            alert("All fields are required.");
            return;
        }

        if (password !== rePassword) {
            alert("Passwords do not match.");
            return;
        }

        if (selectedGenres.length < 5) {
            alert("Please select at least 5 genres.");
            return;
        }

        const userData = {
            firstName,
            lastName,
            email,
            selectedGenres,
        };

        setUser(userData);
        localStorage.setItem("isLoggedIn", "true");
        alert("Registration successful!");

        const firstGenreId = genres.find((genre) => genre.name === selectedGenres[0])?.id;

        if (firstGenreId) {
            navigate(`/movies/genre/${firstGenreId}`);
        } else {
            alert("Invalid genre selected.");
        }
    }

    return (
        <div>
            <Header />
            <div className="formContainerReg">
                <h1 className="formTitleReg">Register</h1>
                <form className="formReg" onSubmit={handleSubmit}>
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
                        disabled={
                            !firstName ||
                            !lastName ||
                            !email ||
                            !password ||
                            !rePassword ||
                            selectedGenres.length < 5
                        }
                    />
                </form>
            </div>
        </div>
    );
}

export default RegisterView;