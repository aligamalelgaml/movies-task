import React from 'react';
import { useSelector } from 'react-redux';
import { selectPage, selectMovieAtPage } from '../movies/moviesSlice';
import { Container, Typography } from '@mui/material';

export default function Stats() {
    const currentPage = useSelector(selectPage);
    const movieData = useSelector(state => selectMovieAtPage(state, currentPage));

    /**
     * Retreives highest rated movie object via Array.reduce.
     */
    const highestRatedMovie = movieData?.reduce((movie, highestRatedMovie) => {
        if (highestRatedMovie.vote_average > movie.vote_average) {
            return highestRatedMovie;
        } else {
            return movie;
        }
    })

    return (
        <>
            <Container>
                <Typography variant="h3" >Movies</Typography>
            </Container>

            <Container sx={{ border: "1px grey solid", marginTop: "20px", padding: "15px" }}>
                <Typography variant="h4" >Stats</Typography>

                <Typography variant="body1" color="initial">Current page: {currentPage}</Typography>
                <Typography variant="body1" color="initial">Number of movies: 20</Typography>
                <Typography variant="body1" color="initial">Top rated movie: {highestRatedMovie?.title}</Typography>
                <Typography variant="body1" color="initial">Rating: {highestRatedMovie?.vote_average.toFixed(1)}</Typography>
            </Container>
        </>
    );
}
