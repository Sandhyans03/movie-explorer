import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Movie } from '../types/movie';

interface FavouritesState {
  /** Full movie summaries so the Favourites tab renders with no network at all. */
  items: Record<number, Movie>;
  /** Ids, newest first. */
  order: number[];
  hydrated: boolean;
  toggle: (movie: Movie) => void;
}

/** Store only the fields the list needs, even if a richer object (e.g. MovieDetails) is passed in. */
function toSummary(movie: Movie): Movie {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    overview: movie.overview,
    release_date: movie.release_date,
  };
}

export const useFavourites = create<FavouritesState>()(
  persist(
    (set) => ({
      items: {},
      order: [],
      hydrated: false,
      toggle: (movie) =>
        set((state) => {
          if (state.items[movie.id]) {
            const items = { ...state.items };
            delete items[movie.id];
            return { items, order: state.order.filter((id) => id !== movie.id) };
          }
          return {
            items: { ...state.items, [movie.id]: toSummary(movie) },
            order: [movie.id, ...state.order],
          };
        }),
    }),
    {
      name: 'favourites-v1',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist data only, never the flags or functions.
      partialize: (state) => ({ items: state.items, order: state.order }),
      // Runs on success and on failure, so the UI never waits on hydration forever.
      onRehydrateStorage: () => () => {
        useFavourites.setState({ hydrated: true });
      },
    },
  ),
);

/** Subscribes to one boolean, so a card only re-renders when its own heart changes. */
export function useIsFavourite(id: number): boolean {
  return useFavourites((state) => id in state.items);
}

export function useFavouriteMovies(): Movie[] {
  const items = useFavourites((state) => state.items);
  const order = useFavourites((state) => state.order);
  return useMemo(() => order.map((id) => items[id]).filter(Boolean), [items, order]);
}
