import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { CARD_GAP, CARD_HEIGHT } from '../utils/constants';
import { colors, spacing } from '../utils/theme';

/** Skeleton rows shaped like MovieCard, pulsing while the first page loads. */
export function LoadingState({ count = 6 }: { count?: number }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel="Loading">
      {Array.from({ length: count }, (_, index) => (
        <Animated.View key={index} style={[styles.row, { opacity }]}>
          <View style={styles.poster} />
          <View style={styles.lines}>
            <View style={[styles.line, { width: '65%' }]} />
            <View style={[styles.line, { width: '30%' }]} />
            <View style={[styles.line, { width: '95%' }]} />
            <View style={[styles.line, { width: '80%' }]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  row: {
    backgroundColor: colors.card,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.md,
    height: CARD_HEIGHT,
    marginBottom: CARD_GAP,
    padding: spacing.sm,
  },
  poster: {
    backgroundColor: colors.skeleton,
    borderRadius: 8,
    height: CARD_HEIGHT - spacing.lg,
    width: 80,
  },
  lines: { flex: 1, gap: spacing.sm, paddingTop: spacing.xs },
  line: { backgroundColor: colors.skeleton, borderRadius: 4, height: 12 },
});