import type { Movie } from '../types/movie';

export type RootStackParamList = {
  Tabs: undefined;
  Details: { movie: Movie };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Favourites: undefined;
};
