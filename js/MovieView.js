const movieView = {
    render: function(data) {
        movieView._renderMovies(data.results); // render is used as a callback function below and will lose `this` context.
        movieView._renderStats(data.stats);
        if(data.stats.page == 1) {
            $(".previous-btn").addClass("d-none");
        } else {
            $(".previous-btn").removeClass("d-none");
        }
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

export default movieView;