import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient, queryPersister } from './src/lib/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ONE_DAY_MS } from './src/utils/constants';

export default function App() {
  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: queryPersister,
          maxAge: ONE_DAY_MS,
          dehydrateOptions: {
            // Cache popular lists and details for offline use; search results are not worth persisting.
            shouldDehydrateQuery: (query) => query.state.status === 'success' && query.queryKey[1] !== 'search',
          },
        }}
      >
        <StatusBar style="light" />
        <RootNavigator />
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
