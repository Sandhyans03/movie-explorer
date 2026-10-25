export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
}

export interface Genre {
  id: number;
  name: string;
}

/** Extra fields only returned by the /movie/{id} endpoint. Optional so a plain Movie can be used as placeholder data. */
export interface MovieDetails extends Movie {
  runtime?: number | null;
  genres?: Genre[];
  tagline?: string | null;
  backdrop_path?: string | null;
}

export interface Paged<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
