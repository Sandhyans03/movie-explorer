import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../utils/theme';

interface Props {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Non-blocking message for failures that happen while data is already on screen. */
export function InlineNotice({ message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.message}>{message}</Text>
      {!!actionLabel && !!onAction && (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  message: { color: colors.muted, flex: 1, fontSize: 13 },
  action: { color: colors.accent, fontSize: 13, fontWeight: '700' },
});
