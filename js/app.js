const movieModel = {
  currentPage: 1,

  init: function () {
  },

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
                resolve(data.results);
            })
            .catch((err) => reject(err));
    
          const save = (data) => {
            this.currentPage = data.page;
            localStorage.setItem(`data${data.page}`, JSON.stringify(data.results));
          };

        } else {
            console.log(`Retreiving ${dataKey}..`);
            resolve(JSON.parse(localStorage.getItem(dataKey)));
        }
    })
  },
};


const movieView = {
    render: function(data) {
        $(".movie-card").remove();
        
        const template = $("#movie-card-template").html();

        data.forEach(movie => {
            const poster = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            
            console.log("Rendering..");

            const rendered = Mustache.render(template, { movieName: movie.original_title, movieRating: movie.vote_average.toFixed(1), movieImgURL: poster });
            $("#movie-content").append(rendered);
        });
    },

    bindPageClick: function(handler) {
        $(".next, .prev").click(function (e) { 
            e.preventDefault();

            handler($(e.target).text());
        });
    }


}

const movieController = {
    init: function() {
        this.selectPage(1);
        movieView.bindPageClick(this.selectPage);
    },

    selectPage: function(order) {
        if (order === "Next") {
            movieModel.currentPage += 1;
        } else {
            movieModel.currentPage = Math.max(movieModel.currentPage - 1, 1); // ensures that currentPage does not fall below 1.
        }

        movieModel.fetchData(movieModel.currentPage).then(movieView.render);
    }
}

movieController.init();