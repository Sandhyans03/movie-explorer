import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatRating } from '../utils/format';
import { colors } from '../utils/theme';

export function RatingBadge({ value }: { value: number | undefined }) {
  return (
    <View style={styles.row} accessibilityLabel={`Rating ${formatRating(value)}`}>
      <Ionicons name="star" size={14} color={colors.accent} />
      <Text style={styles.text}>{formatRating(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  text: { color: colors.text, fontSize: 13, fontWeight: '600' },
});
