import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import PropTypes from "prop-types"; // ✅ Import PropTypes

function MovieCard({ movie, onClick }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  function onFavoriteClick(e) {
    e.stopPropagation(); // Prevent triggering the onClick event (popup)
    e.preventDefault(); // Prevent default behavior
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  }

  return (
    <div className="movie-card" onClick={(e) => onClick(e, movie.id)}>
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ♥
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
}

// ✅ Add PropTypes validation
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string,
    poster_path: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired, // onClick must be a function and required
};

export default MovieCard;
