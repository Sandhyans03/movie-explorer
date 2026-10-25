import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { MovieList } from '../components/MovieList';
import { OfflineBanner } from '../components/OfflineBanner';
import { useOpenMovie } from '../hooks/useOpenMovie';
import type { TabParamList } from '../navigation/types';
import { useFavouriteMovies, useFavourites } from '../store/favouritesStore';
import { colors } from '../utils/theme';

export function FavouritesScreen() {
  const openMovie = useOpenMovie();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const hydrated = useFavourites((state) => state.hydrated);
  const movies = useFavouriteMovies();

  let content: React.ReactNode;
  if (!hydrated) {
    content = <LoadingState count={3} />;
  } else {
    content = (
      <MovieList
        data={movies}
        onPressMovie={openMovie}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favourites yet"
            message="Tap the heart on any movie to save it here. Saved movies work offline."
            actionLabel="Browse movies"
            onAction={() => navigation.navigate('Home')}
          />
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <OfflineBanner />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.bg, flex: 1 },
});
