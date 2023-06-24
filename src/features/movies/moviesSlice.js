import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  currentPage: 1,
  movieData: [],
  isLoading: false,
};

// Thunk function that retreives the pageNumber provided from the TMDB API.
export const fetchMoviesAsync = createAsyncThunk(
  'movies/fetchMovies',
  async (pageNumber) => {
    const response = await axios(`https://api.themoviedb.org/3/trending/movie/week?api_key=f76591075c97e67b7c90de9185ffb80a&page=${pageNumber}`);
    console.log("API Fetched.. ", response.data);

    const { page, results } = response.data; // Deconstruct to retreive page number & results only.
    return { page, results };
  }
);

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    pageUp: (state) => {
      state.currentPage += 1;
    },
    pageDown: (state) => {
      state.currentPage -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMoviesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movieData = state.movieData.concat(action.payload);
      });
  },
});

// Exporting Actions:
export const { pageUp, pageDown } = moviesSlice.actions;

// Exporting Selectors:
export const selectPage = (state) => state.movies.currentPage;
export const selectMovieAtPage = (state, currentPage) => state.movies.movieData.find(results => results.page === currentPage)?.results; // Checks for current page number in movieData array, if not found, returns undefined.
export const selectIsLoading = (state) => state.movies.isLoading;

// Exporting Reducer:
export default moviesSlice.reducer;
