import type { Movie, MovieDetails, Paged } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const REQUEST_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  readonly status?: number;
  /** True when the request never got a response (offline, DNS failure, timeout). */
  readonly isNetwork: boolean;

  constructor(message: string, options: { status?: number; isNetwork?: boolean } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.isNetwork = options.isNetwork ?? false;
  }
}

async function request<T>(
  path: string,
  params: Record<string, string | number> = {},
  signal?: AbortSignal,
): Promise<T> {
  if (!API_KEY) {
    throw new ApiError('Missing TMDB API key. Add EXPO_PUBLIC_TMDB_API_KEY to your .env file and restart Expo.');
  }

  const query = new URLSearchParams({ api_key: API_KEY, language: 'en-US' });
  Object.entries(params).forEach(([key, value]) => query.set(key, String(value)));

  // Abort on timeout (slow networks) as well as when React Query cancels the query.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    const response = await fetch(`${BASE_URL}${path}?${query.toString()}`, { signal: controller.signal });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const body = (await response.json()) as { status_message?: string };
        if (body.status_message) message = body.status_message;
      } catch {
        // body was not JSON; keep the generic message
      }
      throw new ApiError(message, { status: response.status });
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Cancelled by React Query: let it propagate untouched so it is not shown as an error.
    if (signal?.aborted) throw error;
    // Anything else (fetch rejected, our timeout fired) means we could not reach the server.
    throw new ApiError('Network request failed', { isNetwork: true });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

export function fetchPopularMovies(page: number, signal?: AbortSignal) {
  return request<Paged<Movie>>('/movie/popular', { page }, signal);
}

export function searchMovies(query: string, page: number, signal?: AbortSignal) {
  return request<Paged<Movie>>('/search/movie', { query, page, include_adult: 'false' }, signal);
}

export function fetchMovieDetails(id: number, signal?: AbortSignal) {
  return request<MovieDetails>(`/movie/${id}`, {}, signal);
}
