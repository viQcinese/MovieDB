const API_KEY = "enter_key_here"

// ===================
//     UI CONTROL
// ===================

const UICtrl = (function(){

  return {

    showMovies: function(movies) {

      this.hideMovie()
      this.hideJumbotron();
      document.querySelector("#film-list").style.display = "inline"

      document.querySelector("#film-list").innerHTML = "<div class='row'></div>"
      movies.forEach( (movie, index) => {
        if (movie && index < 8) {
          document.querySelector("#film-list").querySelector(".row").innerHTML +=
          `
          <div class="col-3">
            <div class="card my-2">
              <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" imdb="${movie.imdbID}">
            </div>
          </div>
          `
        }
      })
    },

    hideMovies: function() {
      document.querySelector("#film-list").style.display = "none"
    },

    showMovie: function(movie) {

      this.hideMovies()
      this.hideJumbotron();
      document.querySelector("#film-show").style.display = "inline"

      document.querySelector("#film-show").innerHTML = "<div class='row'></div>"
      document.querySelector("#film-show").querySelector(".row").innerHTML = 
        `
      <div class="col-lg-4 col-md-4 col-sm-5 col-12">
        <div class="card mb-3">
          <img src="${movie.Poster}" class="card-img-top">
        </div>
        <div class="card mb-3">
          <div class="card-text m-3" id="ratings">            
          </div>
        </div>
        <button class="btn btn-warning btn-block" id="back-btn">Return</button>
      </div>

      <div class="col-sm-7 col-12">
        <h3>${movie.Title} (${movie.Year})</h3>
        <hr style="background:aliceblue">
        <span style="font-size: 1.4em">${movie.Plot}</span>
        <hr>
        <span><strong style="font-size: 1.2em">Runtime: </strong><em>${movie.Runtime}</em></span> 
        <span><strong style="font-size: 1.2em">| Genre: </strong><em>${movie.Genre}</em></span> 
        <span><strong style="font-size: 1.2em">| Director: </strong><em>${movie.Denre}</em></span> 
        <span><strong style="font-size: 1.2em">| Language: </strong><em>${movie.Language}</em></span> 
        <span><strong style="font-size: 1.2em">| Country: </strong><em>${movie.Country}</em></span> 
        <span><strong style="font-size: 1.2em">| Actors: </strong><em>${movie.Actors}</em></span> 
        <span><strong style="font-size: 1.2em">| Awards: </strong><em>${movie.Awards}</em></span>
        `
        movie.Ratings.forEach(rating => {
          document.querySelector("#ratings").innerHTML += 
          `
          <span><strong style="font-size: 1.2em">${rating.Source}: </strong><em>${rating.Value}</em></span>
          `
        })
        
    },

    hideMovie: function() {
      document.querySelector("#film-show").style.display = "none"
    },

    hideJumbotron: function() {
      document.querySelector("#jumbo-space").style.display = "none"
    }

  }

})();



// ===================
//     DATA CONTROL
// ===================

const DataCtrl = (function(key){

  return {

    getMovies : async function(keyword){
      const moviesResponse = await fetch(`http://www.omdbapi.com/?s=${keyword}&apikey=${key}`);

      console.log(`http://www.omdbapi.com/?s=${keyword}&apikey=${key}`)

      const movies = await moviesResponse.json();

      return movies
    },

    getMovie : async function(id) {
      const movieResponse = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${key}`)

      const movie = await movieResponse.json();

      return movie
    }
  }

})(API_KEY);



// ===================
//     APP CONTROL
// ===================

const App = (function(UICtrl, DataCtrl){

  let lastSearch;

  const loadEventListeners = function(){
    document.querySelector("#search-btn").addEventListener("click", searchButtonEvent)
    document.querySelector("#film-list").addEventListener("click", posterClickEvent)
    document.querySelector("#film-show").addEventListener("click", returnButtonEvent)
    document.querySelector("#search-btn-jumbotron").addEventListener("click", searchButtonJumbotronEvent)

  }

  const searchButtonEvent = async function(e){
    e.preventDefault();
    const keyword = document.querySelector("#search-input").value;
    const data = await DataCtrl.getMovies(keyword)
    lastSearch = data.Search;
    UICtrl.showMovies(data.Search);
    document.querySelector("#search-input").value = ""
  }

  const searchButtonJumbotronEvent = async function(e){
    e.preventDefault();
    const keyword = document.querySelector("#search-input-jumbotron").value;
    const data = await DataCtrl.getMovies(keyword)
    lastSearch = data.Search;
    UICtrl.showMovies(data.Search);
    document.querySelector("#search-input-jumbotron").value = ""
  }

  const posterClickEvent = async function(e) {
    movieId = e.target.getAttribute("imdb")
    const data = await DataCtrl.getMovie(movieId)
    UICtrl.showMovie(data)
  }

  const returnButtonEvent = function(e) {

    if (e.target.id === "back-btn") {
      console.log(lastSearch)
      UICtrl.showMovies(lastSearch)
    }
  }

  return {
    init: function(){
      loadEventListeners();
    }
  }

})(UICtrl, DataCtrl);



// ===================
//      APP INIT
// ===================

App.init()