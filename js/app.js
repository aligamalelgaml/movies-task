const movieModel = {
  currentPage: 1,

  fetchData: function (pageNumber) {
    return new Promise((resolve, reject) => {
        const dataKey = `data${pageNumber}`;
    
        if (!localStorage.getItem(dataKey)) {
          console.log("API working..")
          const URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=f76591075c97e67b7c90de9185ffb80a&page=${pageNumber}`;
    
          fetch(URL)
            .then((response) => {
              if (!response.ok) {
                return Promise.reject(response.status + " error");
              }
              return response.json();
            })
            .then((data) => {
                save(data);
                resolve({results: data.results, stats: movieModel.getpageStats(data.results)});
            })
            .catch((err) => reject(err));
    
          const save = (data) => {
            this.currentPage = data.page;
            localStorage.setItem(`data${data.page}`, JSON.stringify(data.results));
          };

        } else {
            console.log(`Retreiving ${dataKey}..`);
            const data = JSON.parse(localStorage.getItem(dataKey));
            const stats = movieModel.getpageStats(data);

            resolve({results: data, stats: stats});
        }
    })
  },

  getMovieDetails: function (id) {
    return JSON.parse(localStorage.getItem(`data${this.currentPage}`)).find(movie => movie.id == id);
  },

  getpageStats: function(movies) {
    
    const highestRatedMovie = movies.reduce((highest, movie) => {
        if (movie.vote_average > highest.vote_average) {
          return movie;
        } else {
          return highest;
        }
    });

    const stats = {
        page : this.currentPage,
        totalMovies : movies.length,
        topMovie: highestRatedMovie.title,
        topMovieRating: highestRatedMovie.vote_average
    }

    return stats;
  }
};


const movieView = {
    render: function(data) {
        movieView._renderMovies(data.results); // render is used as a callback function below and will lose `this` context.
        movieView._renderStats(data.stats);
    },
    
    _renderMovies: function(data) {
        $(".loader").addClass("d-none");
    
        const template = $("#movie-card-template").html();
    
        data.forEach(movie => {
            const poster = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            
            console.log("Rendering..");
    
            const rendered = Mustache.render(template, { id: movie.id, movieName: movie.original_title, movieRating: movie.vote_average.toFixed(1), movieImgURL: poster });
            $("#movie-content").append(rendered);
        });
    },

    _renderStats: function(stats) {
        const template = $("#stats-template").html();
        const rendered = Mustache.render(template, { pageNumber: stats.page, totalMovies: stats.totalMovies, topMovie: stats.topMovie, topRating: stats.topMovieRating });
        $("#stats-content").append(rendered);
    },

    bindPageClick: function(handler) {
        $(".next, .prev").click(function (e) { 
            e.preventDefault();

            handler($(e.target).text());
            $(".movie-card, .stats").remove();
            $(".loader").removeClass("d-none");
        });
    },

    bindMovieClick: function(handler) {
        $("#movie-content").on("click", ".card", function (e) {
            e.preventDefault();
            $(".popup-img, .popup-info").remove();

            const movie = handler($(e.target).attr("data-id"));  

            const poster = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;

            const template = $("#movie-modal-template").html();
            const rendered = Mustache.render(template, { movieName: movie.original_title, movieRating: movie.vote_average.toFixed(1), movieImgURL: poster, totalVotes: movie.vote_count, overview: movie.overview });

            $("#popup-content").append(rendered);
            
            const moviePopup = document.getElementById("moviePopup");
            moviePopup.showModal();

            $(document).on("click", ".close-button", function () {
                $("#moviePopup")[0].close();
              });

        });

    }

}

const movieController = {
    init: function() {
        this.selectPage(1); // Page initilization.

        movieView.bindPageClick(this.selectPage); // Binds page next/prev buttons to page selection function.

        movieView.bindMovieClick(this.getMovie);

    },

    selectPage: function(order) {
        if (order === "Next") {
            movieModel.currentPage += 1;
        } else {
            movieModel.currentPage = Math.max(movieModel.currentPage - 1, 1); // ensures that currentPage does not fall below 1.
        }

        movieModel.fetchData(movieModel.currentPage).then(movieView.render);
    },

    getMovie: function(movieID) {
        return movieModel.getMovieDetails(movieID);
    }


}

movieController.init();