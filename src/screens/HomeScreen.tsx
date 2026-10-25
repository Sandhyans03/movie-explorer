import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { InlineNotice } from '../components/InlineNotice';
import { LoadingState } from '../components/LoadingState';
import { MovieList } from '../components/MovieList';
import { OfflineBanner } from '../components/OfflineBanner';
import { useOpenMovie } from '../hooks/useOpenMovie';
import { usePopularMovies } from '../hooks/usePopularMovies';
import { colors } from '../utils/theme';

export function HomeScreen() {
  const openMovie = useOpenMovie();
  const query = usePopularMovies();
  const { data, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refresh } = query;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  // Guarded so we never fire duplicate requests, or loop on a failing page while offline.
  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  let content: React.ReactNode;
  if (query.isPending) {
    content = <LoadingState />;
  } else if (query.isError && !data) {
    content = <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  } else {
    content = (
      <>
        {query.isRefetchError && !isFetchNextPageError && (
          <InlineNotice message="Couldn't refresh. Showing saved movies." actionLabel="Retry" onAction={onRefresh} />
        )}
        <MovieList
          data={data ?? []}
          onPressMovie={openMovie}
          onEndReached={onEndReached}
          isFetchingNextPage={isFetchingNextPage}
          nextPageError={isFetchNextPageError}
          onRetryNextPage={() => fetchNextPage()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={<EmptyState icon="film-outline" title="No movies found" message="Pull down to refresh." />}
        />
      </>
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
