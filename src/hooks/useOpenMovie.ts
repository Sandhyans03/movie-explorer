import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import type { RootStackParamList } from '../navigation/types';
import type { Movie } from '../types/movie';

/** Stable callback that opens the details screen. Shared by every list screen. */
export function useOpenMovie() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return useCallback((movie: Movie) => navigation.navigate('Details', { movie }), [navigation]);
}
