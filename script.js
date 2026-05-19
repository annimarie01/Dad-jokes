// API config
const API_KEY = "cfa91572";
const API_BASE = "https://www.omdbapi.com/";

async function getMovieData(query, filter) {
  try {
    const info = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=cfa91572`,
    );
    const response = await info.json();

    if (response.Response === "True") {
      const movies = response.Search;
      console.log(movies);
      
      if (filter === "A_TO_Z") {
        movies.sort((a, b) => a.Title.localeCompare(b.Title));
      } else if (filter === "Z_TO_A") {
        movies.sort((a, b) => b.Title.localeCompare(a.Title));
      } else if (filter === "NEW_TO_OLD") {
        movies.sort((a, b) => new Date(b.Released) - new Date(a.Released));
      } else if (filter === "OLD_TO_NEW") {
        movies.sort((a, b) => new Date(a.Released) - new Date(b.Released));
      }

      const detailedInfo = await fetch(`https://www.omdbapi.com/?i=${movies[0].imdbID}&apikey=cfa91572`);
      const detailedMovie = await detailedInfo.json();
      document.querySelector(".movie").innerHTML = movieHTML(detailedMovie);
    } else {
      console.error(response.Error);
      document.querySelector(".movie").innerHTML = `<p>${response.Error}</p>`; // Show error if movie not found
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
}



function filterMovies(event) {
  getMovieData(event.target.value);
}

// Attach search form handler only when the form exists (prevents errors on movie.html)
const searchForm = document.getElementById("search__wrapper");
if (searchForm) {
  searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const query = document.getElementById("search-input").value;
    await getMovieData(query);
  });
}

// Fetch full movie details by IMDB ID
async function getMovieById(imdbID) {
  try {
    const res = await fetch(`${API_BASE}?i=${encodeURIComponent(imdbID)}&apikey=${API_KEY}`);
    const data = await res.json();
    if (data.Response === "True") return data;
    throw new Error(data.Error || "Movie not found");
  } catch (err) {
    console.error("getMovieById error:", err);
    throw err;
  }
}

function detailedMovieHTML(movie) {
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "./assets/no-poster.png";
  return `
    <figure class="movie__poster--wrapper">
      <img src="${poster}" alt="${movie.Title}" class="movie__poster">
    </figure>
    <div class="movie__info">
      <h2 class="movie__title">${movie.Title}</h2>
      <div class="movie__rated">${movie.Rated || ""}</div>
      <div class="movie__runtime">${movie.Runtime || ""}</div>
      <div class="movie__genre">${movie.Genre || ""}</div>
      <div class="movie__date">Released: ${movie.Released || ""}</div>
      <p class="movie__plot">${movie.Plot || ""}</p>
    </div>
  `;
}

// On the movie details page, populate the detailed view when ?i=IMDB_ID is present
document.addEventListener("DOMContentLoaded", function () {
  const movieInfoSection = document.getElementById("movie-info");
  if (!movieInfoSection) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("i");
  if (!id) return;

  getMovieById(id)
    .then((movie) => {
      const container = document.querySelector(".movie");
      if (container) container.innerHTML = detailedMovieHTML(movie);
    })
    .catch((err) => {
      const container = document.querySelector(".movie");
      if (container) container.innerHTML = `<p class="movie__empty">Unable to load movie details.</p>`;
    });
});

function movieHTML(movie) {
  return `<figure class="movie__poster--wrapper">
                <img src="${movie.Poster}" alt="${movie.Title}" class="movie__poster">
            </figure>
            <div class="movie__info">
                <h2 class="movie__title">${movie.Title}</h2>
                <div class="movie__rated">${movie.Rated}</div>
                <div class="movie__runtime">${movie.Runtime}</div>
                <div class="movie__genre">${movie.Genre}</div>
            </div>`;
  }