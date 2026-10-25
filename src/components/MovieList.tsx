import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, type ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Movie } from '../types/movie';
import { ITEM_HEIGHT } from '../utils/constants';
import { colors, spacing } from '../utils/theme';
import { MovieCard } from './MovieCard';

interface Props {
  data: Movie[];
  onPressMovie: (movie: Movie) => void;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  /** Loading the next page failed: show a retry row instead of retrying in a loop. */
  nextPageError?: boolean;
  onRetryNextPage?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListEmptyComponent?: React.ReactElement | null;
}

const keyExtractor = (movie: Movie) => String(movie.id);

const getItemLayout = (_: ArrayLike<Movie> | null | undefined, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

export function MovieList({
  data,
  onPressMovie,
  onEndReached,
  isFetchingNextPage = false,
  nextPageError = false,
  onRetryNextPage,
  refreshing,
  onRefresh,
  ListEmptyComponent,
}: Props) {
  const renderItem: ListRenderItem<Movie> = useCallback(
    ({ item }) => <MovieCard movie={item} onPress={onPressMovie} />,
    [onPressMovie],
  );

  const footer = isFetchingNextPage ? (
    <ActivityIndicator style={styles.footer} color={colors.accent} />
  ) : nextPageError ? (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Couldn't load more movies.</Text>
      <Pressable onPress={onRetryNextPage} hitSlop={8} accessibilityRole="button">
        <Text style={styles.retry}>Retry</Text>
      </Pressable>
    </View>
  ) : null;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      ListFooterComponent={footer ?? undefined}
      ListEmptyComponent={ListEmptyComponent ?? undefined}
      refreshing={onRefresh ? !!refreshing : undefined}
      onRefresh={onRefresh}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
      removeClippedSubviews
      contentContainerStyle={[styles.content, data.length === 0 && styles.grow]}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  grow: { flexGrow: 1 },
  footer: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  footerText: { color: colors.muted, fontSize: 13 },
  retry: { color: colors.accent, fontSize: 14, fontWeight: '700' },
});
