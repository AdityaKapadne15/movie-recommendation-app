import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const API_KEY = "1b6e61f13d6e8c5013a6f33a1d104adc";
const BASE_URL = "https://api.themoviedb.org/3";

function MovieDetails({ movieId, onClose, dialogPosition }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,reviews`
      );
      const data = await response.json();
      setMovie(data);
      setLoading(false);
    };

    fetchMovieDetails();
  }, [movieId]);

  return (
    <Dialog
      open={!!movieId}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "#222",
          color: "#fff",
          maxHeight: "100vh",
          overflowY: "auto",
          position: "absolute",
          top: dialogPosition?.top,
          left: dialogPosition?.left,
        },
      }}
    >
      <DialogTitle
        style={{ backgroundColor: "#333", color: "#fff", padding: "16px", fontWeight: "bold" }}
      >
        {movie?.title}
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", right: 10, top: 10 }}
        >
          <CloseIcon style={{ color: "#fff" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ padding: "16px" }}>
        {loading ? (
          <CircularProgress style={{ alignContent: "center" }}/>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w780${movie?.backdrop_path}`}
                alt={movie?.title}
                style={{ width: "300px", borderRadius: "8px" }}
              />
              <div style={{padding: "15px"}}>
                <Typography variant="h6" style={{ color: "#fff" }}>
                  <strong>Release Date:</strong> {movie?.release_date}
                </Typography>
                <Typography variant="h6" style={{ color: "#fff" }}>
                <strong>Rating:</strong> {movie?.vote_average} / 10
                </Typography>
                <Typography variant="h6" style={{ color: "#fff" }}>
                <strong>Cast:</strong>{" "}
                  {movie?.credits?.cast
                    .slice(0, 5)
                    .map((actor) => actor.name)
                    .join(", ")}
                </Typography>
              </div>
            </div>
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              <strong>Plot:</strong> {movie?.overview}
            </Typography>
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              <strong>Reviews:</strong>{" "}
              {movie?.reviews?.results.length > 0
                ? `"${movie?.reviews?.results[0].content}"`
                : "No reviews available"}
            </Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

MovieDetails.propTypes = {
  movieId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  dialogPosition: PropTypes.object.isRequired,
};

export default MovieDetails;
