import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Movie } from '../types/movie';
import { CARD_GAP, CARD_HEIGHT } from '../utils/constants';
import { releaseYear } from '../utils/format';
import { colors, spacing } from '../utils/theme';
import { FavouriteButton } from './FavouriteButton';
import { Poster } from './Poster';
import { RatingBadge } from './RatingBadge';

interface Props {
  movie: Movie;
  /** Must be a stable reference (useCallback) or memoisation is pointless. */
  onPress: (movie: Movie) => void;
}

function MovieCardBase({ movie, onPress }: Props) {
  const handlePress = useCallback(() => onPress(movie), [onPress, movie]);
  const year = releaseYear(movie.release_date);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${movie.title}${year ? `, ${year}` : ''}`}
      >
        <Poster path={movie.poster_path} width={80} height={CARD_HEIGHT - spacing.lg} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {movie.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.year}>{year || 'TBA'}</Text>
            <RatingBadge value={movie.vote_average} />
          </View>
          <Text style={styles.overview} numberOfLines={3}>
            {movie.overview || 'No overview available.'}
          </Text>
        </View>
      </Pressable>
      {/*
        The heart is a sibling of the card button, not a child. Nesting a button inside a
        button is invalid HTML on web, and it is better for screen readers on phones too.
      */}
      <View style={styles.favourite}>
        <FavouriteButton movie={movie} />
      </View>
    </View>
  );
}

export const MovieCard = memo(MovieCardBase);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    height: CARD_HEIGHT,
    marginBottom: CARD_GAP,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.sm,
  },
  pressed: { backgroundColor: colors.cardPressed },
  // Right padding leaves room for the heart so text never runs underneath it.
  info: { flex: 1, gap: spacing.xs, paddingRight: spacing.xl + spacing.sm, paddingTop: spacing.xs },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  year: { color: colors.muted, fontSize: 13 },
  overview: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  favourite: { position: 'absolute', right: spacing.md, top: spacing.md },
});