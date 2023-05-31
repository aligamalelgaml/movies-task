const movieModel = {
  pagesAvailable: [],

  init: function () {
    movieModel.fetchData(1);
  },

  fetchData: function (pageNumber) {
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
        .then((data) => save(data))
        .catch((err) => console.log(err));

      const save = (data) => {
        const pageName = `data${data.page}`;
        this.pagesAvailable.push(pageName);
        localStorage.setItem(pageName, JSON.stringify(data.results));
      };
    }

    return JSON.parse(localStorage.getItem(dataKey));
  },
};

movieModel.init();

