//API Key: https://www.omdbapi.com/?i=tt3896198&apikey=cfa91572

async function getMovieData() {
    const info = await fetch("https://www.omdbapi.com/?i=tt3896198&apikey=cfa91572");
    const movie = await info.json();
    
    const showData = document.querySelector(".movie");
    showData.innerHTML = movieHTML(movie);
}

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
                    <div class="movie__date">Released: ${movie.Released}</div>
                    <p class="movie__plot">${movie.Plot}</p>
            </div>`
}