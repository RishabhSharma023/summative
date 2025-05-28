import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Genres from "../Components/Genres";
import Foooter from "../Components/Footer";
import "./MoviesView.css";

function MoviesView() {
    const navigate = useNavigate();
    const location = useLocation();

    const genres = [
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

    useEffect(() => {
        if (location.pathname === "/movies") {
            navigate(`/movies/genre/${genres[0].id}`);
        }
    }, [location, navigate, genres]);

    return (
        <div className="moviesView-container">
            <Header />
            <div className="genres-section">
                <div className="list-of-genres">
                    <Genres genresList={genres} />
                </div>
                <div className="genre-movies">
                    <Outlet />
                </div>
            </div>
            <Foooter />
        </div>
    );
}

export default MoviesView;
