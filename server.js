require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { getSimilarMoviesByName, init, movies } = require("./recommender");
const { getMovieDetails } = require("./omdb");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

console.log("OMDB KEY FROM SERVER:", process.env.OMDB_API_KEY);

/* ---------- TITLE CLEANER ---------- */
function cleanMovieTitle(title) {
  // Remove year
  let cleaned = title.replace(/\(\d{4}\)/, "").trim();

  // Fix ", The"
  if (cleaned.endsWith(", The")) {
    cleaned = "The " + cleaned.replace(", The", "");
  }

  if (cleaned.endsWith(", A")) {
    cleaned = "A " + cleaned.replace(", A", "");
  }

  if (cleaned.endsWith(", An")) {
    cleaned = "An " + cleaned.replace(", An", "");
  }

  return cleaned.trim();
}

/* ---------- INIT DATASET ---------- */
init().then(() => {
  console.log("Dataset Loaded Successfully");

  /* ---------- AUTO SUGGEST ---------- */
  app.get("/search", (req, res) => {
    const query = req.query.q;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const matches = movies
      .filter(m => m.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);

    res.json(matches);
  });

  /* ---------- RECOMMEND ---------- */
  app.post("/recommend", async (req, res) => {
    const movieName = req.body.movie;
    const genre = req.body.genre;

    console.log("Movie Entered:", movieName);

    const recommendations =
      getSimilarMoviesByName(movieName, genre);

    console.log("Recommendations Found:", recommendations);

    let results = [];

    for (let title of recommendations) {
      const fixedTitle = cleanMovieTitle(title);
      const details = await getMovieDetails(fixedTitle);

      if (details) {
        results.push(details);
      } else {
        results.push({
          title: fixedTitle,
          rating: "N/A",
          poster: null
        });
      }
    }

    res.json(results);
  });

  const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});