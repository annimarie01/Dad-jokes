//API Key: https://www.omdbapi.com/?i=tt3896198&apikey=cfa91572

async function getMovieData() {
    let movie = await fetch("https://www.omdbapi.com/?i=tt3896198&apikey=cfa91572");
    let movieData = await movie.json();
    console.log(movieData);
}

getMovieData();