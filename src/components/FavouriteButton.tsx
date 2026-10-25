import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';
import { useFavourites, useIsFavourite } from '../store/favouritesStore';
import type { Movie } from '../types/movie';
import { colors } from '../utils/theme';

interface Props {
  movie: Movie;
  size?: number;
}

export function FavouriteButton({ movie, size = 24 }: Props) {
  const isFavourite = useIsFavourite(movie.id);
  const toggle = useFavourites((state) => state.toggle);

  return (
    <Pressable
      onPress={() => toggle(movie)}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
    >
      <Ionicons
        name={isFavourite ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavourite ? colors.danger : colors.muted}
      />
    </Pressable>
  );
}
