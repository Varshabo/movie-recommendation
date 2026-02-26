const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

let movies = [];
let ratings = [];

function loadMovies() {
  return new Promise((resolve) => {
    fs.createReadStream(path.resolve("./data/movies.csv"))
      .pipe(csv())
      .on("data", (row) => {
        movies.push({
          movieId: Number(row.movieId),
          title: row.title,
          genres: row.genres
        });
      })
      .on("end", resolve);
  });
}

function loadRatings() {
  return new Promise((resolve) => {
    fs.createReadStream(path.resolve("./data/ratings.csv"))
      .pipe(csv())
      .on("data", (row) => {
        ratings.push({
          userId: Number(row.userId),
          movieId: Number(row.movieId),
          rating: Number(row.rating)
        });
      })
      .on("end", resolve);
  });
}

function getSimilarMoviesByName(movieName, selectedGenre, topN = 5) {

  const target = movies.find(m =>
    m.title.toLowerCase().includes(movieName.toLowerCase())
  );

  if (!target) return [];

  // Build rating map (fast lookup)
  const ratingMap = {};
  ratings.forEach(r => {
    if (!ratingMap[r.userId]) {
      ratingMap[r.userId] = {};
    }
    ratingMap[r.userId][r.movieId] = r.rating;
  });

  let scores = [];

  movies.forEach(movie => {

    if (movie.movieId === target.movieId) return;

    if (selectedGenre && selectedGenre !== "All") {
      if (!movie.genres.includes(selectedGenre)) return;
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let userId in ratingMap) {
      const ratingA = ratingMap[userId][target.movieId] || 0;
      const ratingB = ratingMap[userId][movie.movieId] || 0;

      dot += ratingA * ratingB;
      normA += ratingA * ratingA;
      normB += ratingB * ratingB;
    }

    const similarity =
      dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);

    scores.push({
      movieId: movie.movieId,
      similarity
    });

  });

  scores.sort((a, b) => b.similarity - a.similarity);

  return scores
    .slice(0, topN)
    .map(item =>
      movies.find(m => m.movieId === item.movieId).title
    );
}

async function init() {
  await loadMovies();
  await loadRatings();
  console.log("Movies Loaded:", movies.length);
  console.log("Ratings Loaded:", ratings.length);
}

module.exports = {
  getSimilarMoviesByName,
  init,
  movies
};