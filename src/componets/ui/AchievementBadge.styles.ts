import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    badge: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      gap: theme.spacing.xs,
      borderWidth: 1,
    },
    badgeEarned: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primaryLight,
    },
    badgeLocked: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.border,
      opacity: 0.5,
    },
    badgeLabel: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.medium,
      color: theme.colors.textPrimary,
    },
    badgeLabelLocked: {
      color: theme.colors.textSecondary,
    },
  });