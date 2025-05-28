import axios from "axios";
import { useEffect, useState } from "react";
import './Feature.css';

function Featured() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function getData() {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
            );

            const randoMovies = response.data.results.sort(() => 0.5 - Math.random());
            setMovies(randoMovies.slice(0, 3));
        }

        getData();
    }, []);

    return (
        <div className="movie-container">
            {movies.slice(0, 3).map(movie => (
                <div className="movie-card" key={movie.id}>
                    <h1>{movie.title}</h1>
                    <img
                        className="movie-poster"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                </div>
            ))}
        </div>
    );
}

export default Featured;