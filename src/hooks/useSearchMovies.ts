import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { searchMovies } from '../api/tmdb';
import { getNextPageParam, selectUniqueMovies } from '../utils/pagination';

/** `term` should already be debounced by the caller. An empty term disables the query. */
export function useSearchMovies(term: string) {
  const trimmed = term.trim();

  return useInfiniteQuery({
    queryKey: ['movies', 'search', trimmed],
    queryFn: ({ pageParam, signal }) => searchMovies(trimmed, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam,
    select: selectUniqueMovies,
    enabled: trimmed.length > 0,
    // Keep showing the previous results while the next term loads, instead of flashing a spinner.
    placeholderData: keepPreviousData,
  });
}
