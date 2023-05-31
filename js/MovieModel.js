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

  export default movieModel;