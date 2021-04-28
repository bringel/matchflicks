import { API_KEY } from 'react-native-dotenv';

import { MovieGenre } from '../types/theMovieDB';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authentication: `Bearer ${API_KEY}`
};

export function getMovieGenres(): Promise<Array<MovieGenre>> {
  return fetch('https://api.themoviedb.org/3/genre/movie/list', {
    method: 'GET',
    headers: headers
  })
    .then(res => res.json())
    .then(res => res.genres);
}
