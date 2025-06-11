import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DetailView.css";

function DetailView() {
    const [movie, setMovie] = useState({});
    const [trailers, setTrailers] = useState([]);
    const [director, setDirector] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMovieDetails() {
            try {
                const movieResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );
                setMovie(movieResponse.data);

                const creditsResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );
                const directorData = creditsResponse.data.crew.find(
                    (crewMember) => crewMember.job === "Director"
                );
                setDirector(directorData ? directorData.name : "Unknown");

                const trailersResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );
                setTrailers(trailersResponse.data.results.filter((video) => video.type === "Trailer"));
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        }

        fetchMovieDetails();
    }, [id]);

    return (
        <div className="movie-detail">
            <div className="movie-content">
                {movie.poster_path && (
                    <img
                        className="movie-poster"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.original_title}
                    />
                )}
                <h1 className="movie-title">{movie.original_title}</h1>
                <div className="movie-details">
                    <p><strong>Description: </strong>{movie.overview}</p>
                    <p><strong>Release Date: </strong>{movie.release_date}</p>
                    <p><strong>Runtime: </strong>{movie.runtime} minutes</p>
                    <p><strong>Language: </strong>{movie.original_language?.toUpperCase()}</p>
                    <p><strong>Average TMDB Rating: </strong>{movie.vote_average?.toFixed(1)}</p>
                    <p><strong>Director: </strong>{director}</p>
                    <p><strong>Genres: </strong>{movie.genres?.map((genre) => genre.name).join(", ")}</p>
                    <p><strong>Budget: </strong>{movie.budget ? `$${(movie.budget / 1_000_000).toFixed(1)} Million` : "N/A"}</p>
                    <p><strong>Revenue: </strong>{movie.revenue ? `$${(movie.revenue / 1_000_000).toFixed(1)} Million` : "N/A"}</p>
                </div>
            </div>

            <div className="trailers-section">
                <h2>Trailers</h2>
                {trailers.length > 0 ? (
                    <div className="trailers-grid">
                        {trailers.map((trailer) => (
                            <div key={trailer.id} className="trailer-tile">
                                <a
                                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="trailer-thumbnail"
                                        src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                                        alt={trailer.name}
                                    />
                                    <h3 className="trailer-name">{trailer.name}</h3>
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No trailers available.</p>
                )}
            </div>

            <div className="back-button-container">
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
}

export default DetailView;