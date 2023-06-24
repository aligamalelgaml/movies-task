import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { CssBaseline } from '@mui/material';
import Movies from './features/movies/Movies';
import Stats from './features/stats/Stats';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <CssBaseline/>
      <Stats/>
      <Movies/>
    </Provider>
);


