const movieModel = {
  pagesAvailable: [],

  init: function () {
    // movieModel.fetchData(1);
  },

  fetchData: function (pageNumber) {
    return new Promise((resolve, reject) => {
        const dataKey = `data${pageNumber}`;
    
        if (!localStorage.getItem(dataKey)) {
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
                resolve(data);
            })
            .catch((err) => reject(err));
    
          const save = (data) => {
            const pageName = `data${data.page}`;
            this.pagesAvailable.push(pageName);
            localStorage.setItem(pageName, JSON.stringify(data.results));
          };

        } else {
            console.log(`Retreiving ${dataKey}..`);
            return resolve(JSON.parse(localStorage.getItem(dataKey)));
        }
    })
  },
};


const movieView = {
    render: function(results) {
        $(".movie-card").remove();
        
        const template = $("#movie-card-template").html();

        results.forEach(movie => {
            const poster = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            
            console.log("Rendering..");

            const rendered = Mustache.render(template, { movieName: movie.original_title, movieRating: movie.vote_average.toFixed(1), movieImgURL: poster });
            $("#movie-content").append(rendered);
        });
    },

    bindPageClick: function(handler) {
        $(".page-link").click(function (e) { 
            e.preventDefault();

            $(".active").removeClass("active");
            $(e.target).addClass("active");

            const pageNumber = $(e.target).text();
            
            console.log(pageNumber);
            
            handler(pageNumber);
        });
    }


}

const movieController = {
    init: function() {
        movieView.bindPageClick(this.selectPage);
    },

    selectPage: function(pageNumber) {
        movieModel.fetchData(pageNumber).then(movieView.render);
    }
}

movieController.init();
