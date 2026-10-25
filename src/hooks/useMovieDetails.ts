import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetails } from '../api/tmdb';
import type { Movie } from '../types/movie';

/**
 * The list item we already have is used as placeholder data, so the details
 * screen shows title, poster and overview instantly (and offline), then fills
 * in runtime, genres and tagline when the request completes.
 */
export function useMovieDetails(movie: Movie) {
  return useQuery({
    queryKey: ['movies', 'detail', movie.id],
    queryFn: ({ signal }) => fetchMovieDetails(movie.id, signal),
    placeholderData: movie,
  });
}
