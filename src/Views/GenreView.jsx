import "./GenreView.css";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStoreContext } from "../Contexts";

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

function GenreView() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const { genre_id } = useParams();
    const { cart, addToCart, removeFromCart, purchases } = useStoreContext();

    const genre = genres.find((g) => g.id === parseInt(genre_id));
    const title = genre ? genre.genre : "Movies:";

    useEffect(() => {
        const getMovies = async () => {
            try {
                const res = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${genre_id}&page=${page}`
                );
                setMovies(res.data.results);
            } catch (err) {
                console.error("Failed to fetch movies", err);
            }
        };

        getMovies();
    }, [genre_id, page]);

    const isInCart = (movieId) => cart.some((item) => item.id === movieId);
    const isPurchased = (movieId) => purchases?.some((item) => item.id === movieId);

    const handleAddToCart = (movie) => {
        if (isPurchased(movie.id)) {
            alert("You already own this movie!");
            return;
        }
        addToCart(movie);
    };

    return (
        <div className="hero">
            <h2>{title}</h2>

            <div className="genre-view-container">
                {movies.length ? (
                    movies.map((movie) => (
                        <div key={movie.id} className="genre-view-item">
                            <Link to={`/movies/details/${movie.id}`}>
                                {movie.poster_path ? (
                                    <img
                                        className="genre-view-picture"
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </Link>
                            <h3>{movie.title}</h3>
                            <button
                                className="buy-button"
                                onClick={() =>
                                    isInCart(movie.id)
                                        ? removeFromCart(movie.id)
                                        : handleAddToCart(movie)
                                }
                            >
                                {isInCart(movie.id) ? "Added" : "Buy"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No movies found.</p>
                )}
            </div>

            <div className="genre-view-pagination-container">
                <button
                    className="genre-view-pagination-button"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                    Prev
                </button>
                <span className="genre-view-pagination-number">Page {page}</span>
                <button
                    className="genre-view-pagination-button"
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default GenreView;