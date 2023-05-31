import movieModel from './MovieModel.js';
import movieView from './MovieView.js';

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