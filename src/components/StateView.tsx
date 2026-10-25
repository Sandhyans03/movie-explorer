import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../utils/theme';

export interface StateViewProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Centered icon + title + message + optional button. Base for EmptyState and ErrorState. */
export function StateView({ icon, title, message, actionLabel, onAction }: StateViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.muted} />
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {!!actionLabel && !!onAction && (
        <Pressable onPress={onAction} style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.sm, textAlign: 'center' },
  message: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonText: { color: '#111', fontSize: 15, fontWeight: '700' },
});
