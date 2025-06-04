import { useEffect, useContext } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Genres from "../Components/Genres";
import Footer from "../Components/Footer";
import { UserContext } from "../Contexts/UserContext.jsx";
import "./MoviesView.css";

function MoviesView() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

    const allGenres = [
        { genre: "Action", id: 28 },
        { genre: "Adventure", id: 12 },
        { genre: "Animation", id: 16 },
        { genre: "Comedy", id: 35 },
        { genre: "Family", id: 10751 },
        { genre: "Fantasy", id: 14 },
        { genre: "History", id: 36 },
        { genre: "Horror", id: 27 },
        { genre: "Sci-Fi", id: 878 },
        { genre: "Thriller", id: 53 },
    ];

    // Filter genres based on user's selected genres
    const filteredGenres = allGenres.filter((genre) =>
        user?.selectedGenres?.includes(genre.genre)
    );

    useEffect(() => {
        if (location.pathname === "/movies" && filteredGenres.length > 0) {
            navigate(`/movies/genre/${filteredGenres[0].id}`);
        }
    }, [location, navigate, filteredGenres]);

    return (
        <div className="moviesView-container">
            <Header />
            <div className="genres-section">
                <div className="list-of-genres">
                    <Genres genresList={filteredGenres} />
                </div>
                <div className="genre-movies">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MoviesView;