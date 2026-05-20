// API Key and base URL for OMDb
const API_KEY = "cfa91572";
const API_BASE = "https://www.omdbapi.com/";
let currentMovies = [];

function debounce(fn, delay = 400) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

async function searchMovies(query) {
  const container = document.querySelector(".movie");
  if (!query || query.trim().length < 1) {
    currentMovies = [];
    renderMovieResults([]);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
    const info = await res.json();
    if (info.Response === "True") {
      currentMovies = info.Search;
      renderMovieResults(currentMovies);
    } else {
      currentMovies = [];
      renderMovieResults([]);
      container.innerHTML = `<p class="movie__empty">${info.Error}</p>`;
    }
  } catch (err) {
    console.error("Search error:", err);
    currentMovies = [];
    renderMovieResults([]);
    container.innerHTML = `<p class="movie__empty">Unable to fetch results.</p>`;
  }
}

function movieCardHTML(movie) {
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "./assets/no-poster.svg";
  return `
    <a class="movie__card" href="movie.html?i=${movie.imdbID}">
      <figure class="movie__poster--wrapper">
        <img src="${poster}" alt="${movie.Title}" class="movie__poster" />
      </figure>
      <div class="movie__info">
        <h3 class="movie__title">${movie.Title}</h3>
        <div class="movie__year">${movie.Year}</div>
      </div>
    </a>
  `;
}

function renderMovieResults(movies) {
  const container = document.querySelector(".movie");
  const filterContainer = document.getElementById("filter-container");
  if (!container) return;

  if (!movies || movies.length === 0) {
    container.innerHTML = "";
    container.classList.remove("movie--grid");
    if (filterContainer) {
      filterContainer.classList.remove("visible");
    }
    return;
  }

  container.innerHTML = movies.map(movieCardHTML).join("");
  container.classList.add("movie--grid");
  if (filterContainer) {
    filterContainer.classList.add("visible");
  }
}

function filterMovies(event) {
  const filterValue = event.target.value;
  if (!currentMovies.length) return;

  const sorted = [...currentMovies];
  if (filterValue === "A_TO_Z") {
    sorted.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (filterValue === "Z_TO_A") {
    sorted.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (filterValue === "NEW_TO_OLD") {
    sorted.sort((a, b) => {
      const yearA = parseInt(a.Year, 10) || 0;
      const yearB = parseInt(b.Year, 10) || 0;
      return yearB - yearA;
    });
  } else if (filterValue === "OLD_TO_NEW") {
    sorted.sort((a, b) => {
      const yearA = parseInt(a.Year, 10) || 0;
      const yearB = parseInt(b.Year, 10) || 0;
      return yearA - yearB;
    });
  }

  renderMovieResults(sorted);
}

// Hook up form submit and input (debounced) for live search
const form = document.getElementById("search__wrapper");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const q = document.getElementById("search-input").value;
    searchMovies(q);
  });

  const input = document.getElementById("search-input");
  if (input) {
    const debounced = debounce((e) => {
      const val = e.target.value;
      if (val.length >= 3) searchMovies(val);
        else if (val.length === 0) renderMovieResults([]);
      }, 450);
      input.addEventListener("input", debounced);
    }
  }

const filterSelect = document.getElementById("movie-filter");
if (filterSelect) {
  filterSelect.addEventListener("change", filterMovies);
}

// Optional: expose function name used elsewhere
window.searchMovies = searchMovies;
window.filterMovies = filterMovies;
