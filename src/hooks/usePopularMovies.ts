import { useCallback } from 'react';
import { type InfiniteData, onlineManager, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPopularMovies } from '../api/tmdb';
import type { Movie, Paged } from '../types/movie';
import { getNextPageParam, selectUniqueMovies } from '../utils/pagination';

export const POPULAR_QUERY_KEY = ['movies', 'popular'] as const;

export function usePopularMovies() {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: POPULAR_QUERY_KEY,
    queryFn: ({ pageParam, signal }) => fetchPopularMovies(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam,
    select: selectUniqueMovies,
  });

  const { refetch } = query;

  /**
   * Pull-to-refresh. Online: drop back to page 1 first so we refetch one page,
   * not every page scrolled so far. Offline: keep the cached pages so a failed
   * refresh does not wipe what the person is looking at.
   */
  const refresh = useCallback(async () => {
    if (onlineManager.isOnline()) {
      queryClient.setQueryData<InfiniteData<Paged<Movie>>>(POPULAR_QUERY_KEY, (data) =>
        data ? { pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1) } : data,
      );
    }
    await refetch();
  }, [queryClient, refetch]);

  return { ...query, refresh };
}
