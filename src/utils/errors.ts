import { ApiError } from '../api/tmdb';

/** Turns any thrown value into a message that is safe and useful to show to a person. */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetwork) {
      return 'We could not reach the server. Check your connection (it may be offline or slow) and try again.';
    }
    if (error.status === 401) {
      return 'The TMDB API key was rejected. Check EXPO_PUBLIC_TMDB_API_KEY in your .env file.';
    }
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

/** Network failures are not worth retrying on a timer: we wait for the connection to return instead. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError) {
    if (error.isNetwork) return false;
    if (error.status !== undefined && error.status < 500) return false;
  }
  return failureCount < 2;
}
