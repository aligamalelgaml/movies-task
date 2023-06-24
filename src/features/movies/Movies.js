import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pageUp, pageDown, fetchMoviesAsync, selectPage, selectMovieAtPage, selectIsLoading } from './moviesSlice';
import { Stack, Container, Button, CircularProgress, Card, CardContent, Typography, Grid, Modal, Box } from '@mui/material';

export default function Movies() {
  const currentPage = useSelector(selectPage);
  const movieData = useSelector(state => selectMovieAtPage(state, currentPage));
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();

  /**
   * If the movie data array is undefined (i.e. no data for new page number) , it will call the fetchMoviesAsync function with the new page number.
   */
  useEffect(() => {
    if (!movieData) {
      dispatch(fetchMoviesAsync(currentPage))
    }   // eslint-disable-next-line
  }, [currentPage]);

  // Modal state & functions:
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const handleClose = () => setOpen(false);

  /**
   * Updates selected movie & opens the modal once a card is clicked.
   */
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setOpen(true)
  }

  return (
    <>
      <Container sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        {isLoading && <CircularProgress />}
      </Container>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="movie-modal-title"
          aria-describedby="movie-modal-description"
        >
          <Box sx={{
            display: "flex",
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "45vw",
            bgcolor: 'background.paper',
          }}>
            <img src={`https://image.tmdb.org/t/p/w300${selectedMovie?.poster_path}`} alt={`poster for ${selectedMovie?.title}`} />

            <Stack sx={{pl: 3}}>
              <Typography id="movie-modal-title" variant='h3' sx={{ mt: 2 }}>
                {selectedMovie?.title}
              </Typography>

              <Typography variant='h4' sx={{ mt: 2 }}>
                IMDB Rating: {selectedMovie?.vote_average.toFixed(2)} / 10 ({selectedMovie?.vote_count} votes)
              </Typography>

              <Typography id="movie-modal-description" variant='body1' sx={{ mt: 2 }}>
                {selectedMovie?.overview}
              </Typography>

            </Stack>
          </Box>
        </Modal>
      </div>

      <Container>
        <Grid
          container
          spacing={3}
          direction="row"
          wrap="wrap"
          sx={{ marginTop: "20px" }}
        >

          {movieData?.map((movie) =>
            <Grid item xs={3} key={movie.id}>
              <Card onClick={() => handleSelectMovie(movie)} sx={{ height: "100%" }}>
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
          {currentPage !== 1 && <Button onClick={() => dispatch(pageDown())} variant='contained'>Previous</Button>}
          <Button onClick={() => dispatch(pageUp())} variant='contained'>NEXT</Button>
        </Stack>
      </Container>
    </>
  );
}
