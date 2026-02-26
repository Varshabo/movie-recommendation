# 🎬 Movie Recommendation System



---

## 🚀 Features

- 🔍 Search movies with auto-suggestions
- 🎯 Personalized movie recommendations
- 📊 Collaborative filtering (cosine similarity)
- 🎬 Movie posters & ratings from OMDb API
- 🌐 Deployed on Render (Public Link)
- 📱 Responsive UI (Works on Mobile)

---

## 🧠 How It Works

1. Uses MovieLens dataset (ml-latest-small)
2. Builds user-movie rating matrix
3. Applies Cosine Similarity
4. Returns top similar movies
5. Fetches posters & ratings using OMDb API

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- JavaScript
- HTML5 / CSS3
- MovieLens Dataset
- OMDb API
- Render (Deployment)

---

## 📁 Project Structure


movie-recommendation/
│
├── data/
│ ├── movies.csv
│ └── ratings.csv
│
├── public/
│ └── index.html
│
├── recommender.js
├── omdb.js
├── server.js
├── package.json
└── README.md



---

## ⚙️ Installation (Run Locally)

```bash
git clone https://github.com/Varshabo/movie-recommendation.git
cd movie-recommendation
npm install
npm start


open: http://localhost:3000
