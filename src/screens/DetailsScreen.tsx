import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { InlineNotice } from '../components/InlineNotice';
import { OfflineBanner } from '../components/OfflineBanner';
import { Poster } from '../components/Poster';
import { RatingBadge } from '../components/RatingBadge';
import { useMovieDetails } from '../hooks/useMovieDetails';
import type { RootStackParamList } from '../navigation/types';
import type { MovieDetails } from '../types/movie';
import { formatRuntime, releaseYear } from '../utils/format';
import { colors, spacing } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ route }: Props) {
  const { movie } = route.params;
  const query = useMovieDetails(movie);

  // Always render something: fall back to the list item we navigated with.
  const details: MovieDetails = query.data ?? movie;
  const genres = details.genres ?? [];
  const meta = [releaseYear(details.release_date), formatRuntime(details.runtime)].filter(Boolean).join(' · ');

  return (
    <View style={styles.container}>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Poster path={details.poster_path} size="w342" width={140} height={210} radius={12} />
          <View style={styles.heroInfo}>
            <Text style={styles.title}>{details.title}</Text>
            {!!details.tagline && <Text style={styles.tagline}>{details.tagline}</Text>}
            <RatingBadge value={details.vote_average} />
            {!!meta && <Text style={styles.meta}>{meta}</Text>}
          </View>
        </View>

        {genres.length > 0 && (
          <View style={styles.genres}>
            {genres.map((genre) => (
              <View key={genre.id} style={styles.chip}>
                <Text style={styles.chipText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.section}>Overview</Text>
        <Text style={styles.overview}>{details.overview || 'No overview available.'}</Text>

        {query.isPlaceholderData && query.isFetching && (
          <ActivityIndicator style={styles.loader} color={colors.accent} />
        )}
        {query.isError && (
          <InlineNotice
            message="Couldn't load the full details."
            actionLabel="Retry"
            onAction={() => query.refetch()}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.bg, flex: 1 },
  content: { gap: spacing.md, paddingBottom: spacing.xl, paddingTop: spacing.lg },
  hero: { flexDirection: 'row', gap: spacing.lg, paddingHorizontal: spacing.lg },
  heroInfo: { flex: 1, gap: spacing.sm, paddingTop: spacing.xs },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  tagline: { color: colors.muted, fontSize: 14, fontStyle: 'italic' },
  meta: { color: colors.muted, fontSize: 14 },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.lg },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  chipText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  section: { color: colors.text, fontSize: 16, fontWeight: '700', paddingHorizontal: spacing.lg },
  overview: { color: colors.muted, fontSize: 15, lineHeight: 22, paddingHorizontal: spacing.lg },
  loader: { marginTop: spacing.md },
});
