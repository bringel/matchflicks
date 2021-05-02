import React from 'react';
import { Text, View } from 'react-native';

import { useMovieGenres } from '../../services/tmdb';
import { tailwind } from '../../tailwind';

interface Props {}

export const Genres = (props: Props) => {
  const { data: genres } = useMovieGenres();

  return (
    <View style={tailwind('p-4')}>
      <Text style={tailwind('text-grey-100 text-xl mb-2')}>
        Select your favorite movie genres. These will be used when choosing movies to swipe on.
      </Text>

      <Text style={tailwind('text-grey-100 text-base')}>
        You will also see movies from other genres, or genres chosen by your friends or your groups
      </Text>
    </View>
  );
};
