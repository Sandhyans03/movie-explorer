import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { type PosterSize, posterUrl } from '../utils/format';
import { colors } from '../utils/theme';

interface Props {
  path: string | null;
  size?: PosterSize;
  width: number;
  height: number;
  radius?: number;
}

export function Poster({ path, size = 'w185', width, height, radius = 8 }: Props) {
  const uri = posterUrl(path, size);

  if (!uri) {
    return (
      <View style={[styles.fallback, { width, height, borderRadius: radius }]}>
        <Ionicons name="film-outline" size={Math.min(width, height) / 3} color={colors.muted} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width, height, borderRadius: radius, backgroundColor: colors.skeleton }}
      contentFit="cover"
      transition={150}
      // Poster files are cached in memory and on disk, so scrolling back (or going offline) stays smooth.
      cachePolicy="memory-disk"
      recyclingKey={path ?? undefined}
      accessibilityIgnoresInvertColors
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    backgroundColor: colors.skeleton,
    justifyContent: 'center',
  },
});
