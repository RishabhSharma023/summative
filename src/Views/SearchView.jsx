import "./SearchView.css";
import { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useStoreContext } from "../Contexts";

function SearchView() {
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [searchParams] = useSearchParams();
    const { cart, addToCart, removeFromCart, purchases } = useStoreContext();

    useEffect(() => {
        const query = searchParams.get("query") || "";
        setDebouncedQuery(query);
    }, [searchParams]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedQuery) {
                setSearchResults([]);
                setTotalPages(1);
                return;
            }

            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${debouncedQuery}&page=${currentPage}`
                );
                setSearchResults(response.data.results);
                setTotalPages(response.data.total_pages);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchSearchResults();
    }, [debouncedQuery, currentPage]);

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
        <div className="search-view">
            <h1 className="search-title">Search Results</h1>
            {searchResults.length > 0 ? (
                <>
                    <div className="search-results-grid">
                        {searchResults.map((movie) => (
                            <div key={movie.id} className="search-result-item">
                                <Link to={`/movies/details/${movie.id}`}>
                                    {movie.poster_path ? (
                                        <img
                                            className="search-result-poster"
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                        />
                                    ) : (
                                        <div className="no-image">No Image</div>
                                    )}
                                </Link>
                                <h3 className="search-result-title">{movie.title}</h3>
                                <button
                                    className={`buy-button ${isPurchased(movie.id) ? 'owned' : ''}`}
                                    onClick={() =>
                                        isInCart(movie.id)
                                            ? removeFromCart(movie.id)
                                            : handleAddToCart(movie)
                                    }
                                    disabled={isPurchased(movie.id)}
                                >
                                    {isPurchased(movie.id) ? "Owned" : isInCart(movie.id) ? "Added" : "Buy"}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="pagination-container">
                        <button
                            className="pagination-button"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="pagination-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="pagination-button"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="no-results-message">No results found. Try searching for something else.</p>
            )}
        </div>
    );
}

export default SearchView;