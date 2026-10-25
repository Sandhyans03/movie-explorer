import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/** On web the browser tells us directly via navigator.onLine; on phones this is always true. */
function readBrowserOnline(): boolean {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}

/**
 * `null` values from NetInfo (state not known yet) count as online, so the offline
 * banner never flashes on app start. On web we also listen to the browser's own
 * online/offline events, which react instantly when the Wi-Fi is switched off.
 */
export function useNetworkStatus() {
  const { isConnected, isInternetReachable } = useNetInfo();
  const [browserOnline, setBrowserOnline] = useState(readBrowserOnline);

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;

    const update = () => setBrowserOnline(readBrowserOnline());
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return { isOnline: browserOnline && isConnected !== false && isInternetReachable !== false };
}