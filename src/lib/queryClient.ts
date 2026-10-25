import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { ONE_DAY_MS } from '../utils/constants';
import { shouldRetry } from '../utils/errors';

// Tell React Query when the device is online, so it refetches on reconnect.
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(state.isConnected !== false && state.isInternetReachable !== false);
  });
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      // Must be >= the persister's maxAge, otherwise restored data is garbage collected.
      gcTime: ONE_DAY_MS,
      retry: shouldRetry,
      // Run the request even when offline so a failure surfaces as an error state
      // (instead of a query stuck "paused" behind a spinner).
      networkMode: 'offlineFirst',
    },
  },
});

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'movie-explorer-query-cache',
});
