import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pageUp, pageDown, fetchMoviesAsync, selectPage, selectMovieAtPage, selectIsLoading } from './moviesSlice';
import { Stack, Container, Button, CircularProgress, Card, CardContent, Typography, Grid} from '@mui/material';

export default function Movies() {
  const currentPage = useSelector(selectPage);
  const movieData = useSelector(state => selectMovieAtPage(state, currentPage));
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();

  /**
   * If the movie data array does not contain an object with the new page number, it will call the fetchMoviesAsync function with the new page number.
   */
  useEffect(() => {
    if (!movieData) {
      dispatch(fetchMoviesAsync(currentPage))
    }
  }, [currentPage]);


  return (
    <>
      {console.log(movieData)}

      <Container sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        {isLoading && <CircularProgress />}
      </Container>


      <Container>
        <Grid
          container
          spacing={3}
          direction="row"
          wrap="wrap"
          sx={{ marginTop: "40px" }}
        >

          {movieData?.map((movie) =>
            <Grid item xs={3} key={movie.id}>
              <Card sx={{ height: "100%" }}>
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={`poster for ${movie.title}`} style={{ width: "100%" }} />

                <div>
                  <CardContent>
                    <Typography align='center' gutterBottom variant="h5" component="div">
                      {movie.title}
                    </Typography>
                    <Typography align='center' sx={{}} variant="body1" color="text.secondary">
                      {movie.vote_average.toFixed(1)}
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>)
          }
        </Grid>
      </Container>

      <Container sx={{ marginTop: "40px" }}>
        <Stack direction={"row"} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} gap={3}>
          {currentPage !== 1 && <Button onClick={() => dispatch(pageDown())} variant='contained'>page down</Button>}
          Page number: {currentPage}
          <Button onClick={() => dispatch(pageUp())} variant='contained'>page up</Button>
        </Stack>
      </Container>
    </>
  );
}
