# Movie Explorer

A React Native (Expo + TypeScript) app for browsing popular movies, searching, saving favourites and reading details. It is built to stay usable on slow or dropping networks.

**Demo (2-minute screen recording):** https://drive.google.com/file/d/1OUJSflA2MCw1UeBySoDVC4qSCiivGXR2/view?usp=sharing

## Features

- **Home:** popular movies from TMDB with infinite scroll and pull-to-refresh.
- **Search:** debounced input (400 ms), infinite scroll over results, clear button.
- **Details:** poster, rating, overview, runtime and genres. The screen renders instantly from the list item, then fills in extra details.
- **Favourites:** heart any movie (Home, Search or Details). Saved on the device with AsyncStorage and shown in their own tab, with a count badge. They work fully offline.
- **States:** skeleton loading, empty states (no search term, no results, no favourites), error states with retry, a footer retry when loading the next page fails.
- **Network drops:** an offline banner appears, cached data stays on screen, and queries refetch automatically when the connection returns.
- **Runs on phone and web:** tested with Expo Go on a phone and in the browser.

## Setup

Requirements: Node 20+, a free [TMDB API key](https://www.themoviedb.org/settings/api) (the v3 "API Key", not the read access token).

```bash
npm install
```

Create a file named `.env` (copy `.env.example`; on Windows PowerShell use `copy .env.example .env`) and paste your key into it:

```
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_v3_api_key_here
```

Then start the app:

```bash
npx expo start
```

- **Phone:** scan the QR code with the Expo Go app.
- **Browser:** press `w` in the terminal.

Restart `expo start` after editing `.env`. Variables prefixed `EXPO_PUBLIC_` are bundled into the app, which is normal for a TMDB client key, but do not reuse a secret key here.

### Testing the offline behaviour

1. Open the app online and scroll Home so a few pages load.
2. Go offline: turn on airplane mode on a phone, or in the browser press `F12`, open the Network tab and set "No throttling" to "Offline". The banner appears and the list stays visible.
3. Pull to refresh (phone): it fails gracefully and the saved list stays. Pull-to-refresh is a touch gesture, so it is not available with a mouse in the browser.
4. Scroll to the end: the footer shows "Couldn't load more movies. Retry".
5. Force-close and reopen the app offline: Home still shows the cached movies, and Favourites works.
6. Go back online: data refetches by itself.

## Architecture

Server data and client data are handled by different tools on purpose.

| Concern | Tool | Why |
| --- | --- | --- |
| Server data (popular, search, details) | TanStack Query | Caching, pagination (`useInfiniteQuery`), request cancellation, retries, refetch on reconnect |
| Favourites | Zustand + `persist` to AsyncStorage | Small, synchronous client state that must survive restarts |
| Offline cache across restarts | Query cache persisted to AsyncStorage | Home and details open with data even with no network on a cold start |
| Connectivity | NetInfo (plus browser online/offline events on web), wired into React Query's `onlineManager` | One source of truth for the banner and for refetch-on-reconnect |

```
App.tsx                      providers (query cache persistence, safe area)
src/
  api/tmdb.ts                typed fetch client: timeout, cancellation, ApiError
  hooks/                     usePopularMovies, useSearchMovies, useMovieDetails,
                             useDebounce, useNetworkStatus, useOpenMovie
  store/favouritesStore.ts   Zustand store + persistence
  lib/queryClient.ts         QueryClient defaults, persister, online wiring
  components/                MovieCard, MovieList, Poster, RatingBadge, FavouriteButton,
                             SearchBar, StateView (EmptyState, ErrorState), LoadingState,
                             OfflineBanner, InlineNotice
  screens/                   Home, Search, Details, Favourites
  navigation/                bottom tabs + stack, param types
  utils/                     theme, constants, formatting, error messages, pagination helpers
  types/movie.ts
```

### Decisions worth knowing about

- **Smooth lists:** cards have a fixed height so `FlatList` can use `getItemLayout`; `MovieCard` is wrapped in `React.memo` and gets a stable `onPress`; posters use `expo-image` with disk caching; each card subscribes only to its own favourite flag, so toggling one heart re-renders one card.
- **No duplicate or runaway requests:** `onEndReached` checks `hasNextPage` and `isFetchingNextPage`, and stops auto-loading after a failed page so an offline user is not stuck in a retry loop. Results are de-duplicated by id because TMDB's ranking can shift between pages.
- **Pull-to-refresh:** online, it trims the cache to page 1 and refetches one page instead of every page scrolled. Offline, it keeps the cached pages.
- **Errors are shown by context:** a first-load failure is a full-screen error with retry; a refresh or next-page failure is an inline notice, because the person already has data to look at.
- **Favourites store full movie summaries**, not just ids, so the tab renders without any request.
- **Search is not persisted** to the offline cache (it would grow without much benefit). Popular pages and details are.
- **Valid HTML on web:** the favourite heart is a sibling of the card button, not nested inside it, because a button inside a button is invalid on the web.

## Trade-offs and next steps

- The persisted cache keeps data for 24 hours; there is no manual "clear cache" control.
- Search results are not available on a cold start while offline.
- No automated tests yet. Possible additions: unit tests for the hooks and store, sorting favourites, and a genre filter.

---

This product uses the TMDB API but is not endorsed or certified by TMDB.