import { Link, useParams } from "react-router-dom";
import "./Genres.css";

function Genres({ genresList }) {
  const { genre_id } = useParams();

  return (
    <div className="genre-buttons">
      {genresList.map((g) => (
        <Link to={`/movies/genre/${g.id}`} key={g.id}>
          <button
            className={`genre-button ${genre_id == g.id ? "selected" : ""}`}
          >
            {g.genre}
          </button>
        </Link>
      ))}
    </div>
  );
}

export default Genres;
