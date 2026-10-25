const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type PosterSize = 'w185' | 'w342' | 'w500';

export function posterUrl(path: string | null | undefined, size: PosterSize = 'w185'): string | null {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export function releaseYear(date: string | undefined): string {
  return date ? date.slice(0, 4) : '';
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export function formatRating(value: number | undefined): string {
  return value && value > 0 ? value.toFixed(1) : 'N/A';
}
