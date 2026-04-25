//API Key: https://www.omdbapi.com/?i=tt3896198&apikey=cfa91572

async function getMovieData(query, filter) {
  try {
    const info = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=cfa91572`,
    );
    const response = await info.json();

    if (response.Response === "True") {
      const movie = response.Search[0];// Assuming you want the first movie from the search
      
      if (filter === "A_TO_Z") {
        movie.sort((a, b) => a.Title.localeCompare(b.Title));
      } else if (filter === "Z_TO_A") {
        movie.sort((a, b) => b.Title.localeCompare(a.Title));
      } else if (filter === "NEW_TO_OLD") {
        movie.sort((a, b) => new Date(b.Released) - new Date(a.Released));
      } else if (filter === "OLD_TO_NEW") {
        movie.sort((a, b) => new Date(a.Released) - new Date(b.Released));
      }

      displayMovie(movie);
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

  document
    .getElementById("search__wrapper")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const query = document.getElementById("search-input").value;
      await getMovieData(query);
    });

getMovieData();

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