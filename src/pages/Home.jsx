import { useState, useEffect, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import MovieDetails from "../components/MovieDetails"; // ✅ Import the popup
import GenreFilter from "../components/GenreFilter";
import { searchMovies } from "../services/api";
import "../css/Home.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
// import { useMovieContext } from "../contexts/MovieContext"; // ✅ Import MovieContext

const API_KEY = "1b6e61f13d6e8c5013a6f33a1d104adc";
const BASE_URL = "https://api.themoviedb.org/3";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null); // ✅ Store selected movie for popup
  const [dialogPosition, setDialogPosition] = useState(null); // ✅ Store dialog position for dynamic positioning

  // const { favorites } = useMovieContext(); // ✅ Get favorites from context

  const loadMovies = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
      if (selectedGenre) {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.results);
    } catch (err) {
      console.error(err);
      setError("Failed to load movies...");
    } finally {
      setLoading(false);
    }
  }, [selectedGenre]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return; // Prevent search if input is empty or loading is true
    
    setLoading(true);
    setError(null); // Reset error before initiating a new search
  
    try {
      const searchResults = await searchMovies(searchQuery); // Make sure this method returns the correct search results
  
      if (searchResults.length === 0) {
        alert("Sorry, Not able to find any movies..."); // Set error if no results are found
        setError(null);
      } else {
        setMovies(searchResults); // Set movies if results are found
        setError(null); // Reset error
      }
    } catch (err) {
      console.error(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };  

  const handleClearSearch = async () => {
    setSearchQuery("");
    loadMovies();
  };

  const handleMovieClick = (e, movieId) => {
    // Get the position of the movie card
    const rect = e.target.closest(".movie-card").getBoundingClientRect();
    setDialogPosition({
      top: rect.top + window.scrollY, // top position relative to viewport
      // left: rect.left + window.scrollX, // left position relative to viewport
    });
    setSelectedMovieId(movieId); // Open the dialog
  };

  return (
    <div className="home">
      <div style={{ display: "flex" }}>
        <form onSubmit={handleSearch} className="search-form">
          <TextField
            fullWidth
            variant="standard"
            size="small"
            placeholder="Search for movies..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#1976d2" }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch}>
                    <ClearIcon sx={{ color: "#d32f2f" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        <GenreFilter onGenreSelect={setSelectedGenre} style={{ width: "100%" }} />
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={(e) => handleMovieClick(e, movie.id)} // ✅ Open popup on click
              />
            ))}
          </div>
        </>
      )}

      {/* ✅ Popup for movie details with dynamic position */}
      {selectedMovieId && dialogPosition && (
        <MovieDetails
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          dialogPosition={dialogPosition} // Pass dialog position here
        />
      )}
    </div>
  );
}

export default Home;
