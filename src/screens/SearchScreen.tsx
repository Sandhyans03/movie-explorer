import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { MovieList } from '../components/MovieList';
import { OfflineBanner } from '../components/OfflineBanner';
import { SearchBar } from '../components/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { useOpenMovie } from '../hooks/useOpenMovie';
import { useSearchMovies } from '../hooks/useSearchMovies';
import { SEARCH_DEBOUNCE_MS } from '../utils/constants';
import { colors } from '../utils/theme';

export function SearchScreen() {
  const openMovie = useOpenMovie();
  const [text, setText] = React.useState('');
  const debounced = useDebounce(text, SEARCH_DEBOUNCE_MS);
  const term = debounced.trim();

  const query = useSearchMovies(term);
  const { data, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = query;

  // Results on screen belong to an older term while the new one is debouncing or loading.
  const isStale = query.isPlaceholderData || text.trim() !== term;

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  let content: React.ReactNode;
  if (text.trim().length === 0) {
    content = (
      <EmptyState icon="search-outline" title="Search for a movie" message="Type a title to find it." />
    );
  } else if (query.isPending) {
    content = <LoadingState count={4} />;
  } else if (query.isError && !data) {
    content = <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  } else if (data && data.length === 0 && !isStale) {
    content = (
      <EmptyState
        icon="sad-outline"
        title="No results"
        message={`We couldn't find anything for "${term}". Try a different title.`}
      />
    );
  } else {
    content = (
      <View style={[styles.flex, isStale && styles.stale]}>
        <MovieList
          data={data ?? []}
          onPressMovie={openMovie}
          onEndReached={onEndReached}
          isFetchingNextPage={isFetchingNextPage}
          nextPageError={isFetchNextPageError}
          onRetryNextPage={() => fetchNextPage()}
        />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <OfflineBanner />
      <SearchBar value={text} onChangeText={setText} />
      <View style={styles.flex}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { backgroundColor: colors.bg, flex: 1 },
  stale: { opacity: 0.5 },
});
