//@ts-ignore
import { API_KEY } from 'react-native-dotenv';
import { useQuery } from 'react-query';

import { MovieGenre } from '../types/tmdb';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_KEY}`
};

function apiURL(path: string) {
  return `https://api.themoviedb.org/3/${path.replace(/^\//, '')}`;
}

export const useMovieDBConfig = () => {
  return useQuery('configuration', () => {
    return fetch(apiURL('configuration'), {
      method: 'GET',
      headers: headers
    }).then(res => res.json());
  });
};

export const useMovieGenres = () => {
  return useQuery<Array<MovieGenre>>('genreList', () => {
    return fetch(apiURL('genre/movie/list'), {
      method: 'GET',
      headers: headers
    })
      .then(res => res.json())
      .then(res => res.genres);
  });
};
