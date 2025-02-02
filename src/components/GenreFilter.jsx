import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "../css/GenreFilter.css";

const API_KEY = "1b6e61f13d6e8c5013a6f33a1d104adc";
const BASE_URL = "https://api.themoviedb.org/3";

function GenreFilter({ onGenreSelect }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleChange = (event) => {
    setSelectedGenre(event.target.value);
    onGenreSelect(event.target.value);
  };

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{ minWidth: 150, marginBottom: 2 }}
    >
      <InputLabel>Genre</InputLabel>
      <Select
        value={selectedGenre}
        onChange={handleChange}
        label="Genre"
        style={{
          margin: "0 10px",
          backgroundColor: "#646cff",
          color: "#ffffff !important",
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 500, // Optional: Limit dropdown height if list is long
              width: "auto",  // Ensure it takes width of the button
            },
          },
        }}
      >
        <MenuItem value="">All</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            {genre.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

GenreFilter.propTypes = {
  onGenreSelect: PropTypes.func.isRequired, // Ensures a function is passed
};

export default GenreFilter;
