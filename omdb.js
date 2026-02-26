require("dotenv").config();
const axios = require("axios");

console.log("Using OMDB Key:", process.env.OMDB_API_KEY);

async function getMovieDetails(title) {
  try {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: process.env.OMDB_API_KEY,
        t: title
      }
    });

    if (response.data.Response === "True") {
      return {
        title: response.data.Title,
        rating: response.data.imdbRating,
        poster:
          response.data.Poster !== "N/A"
            ? response.data.Poster
            : null
      };
    }

    return null;
  } catch {
    return null;
  }
}

module.exports = { getMovieDetails };