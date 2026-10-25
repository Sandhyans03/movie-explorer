import type { InfiniteData } from '@tanstack/react-query';
import type { Movie, Paged } from '../types/movie';

/** TMDB refuses requests beyond page 500. */
const TMDB_MAX_PAGES = 500;

export function getNextPageParam(lastPage: Paged<Movie>): number | undefined {
  return lastPage.page < Math.min(lastPage.total_pages, TMDB_MAX_PAGES) ? lastPage.page + 1 : undefined;
}

/**
 * Flattens pages into one list. TMDB's popularity ranking can shift between page
 * requests, so the same movie can appear twice; duplicate ids would break FlatList keys.
 */
export function selectUniqueMovies(data: InfiniteData<Paged<Movie>>): Movie[] {
  const seen = new Set<number>();
  const movies: Movie[] = [];
  for (const page of data.pages) {
    for (const movie of page.results) {
      if (!seen.has(movie.id)) {
        seen.add(movie.id);
        movies.push(movie);
      }
    }
  }
  return movies;
}
