import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      alignItems: "center",
      paddingVertical: theme.spacing.md,
    },
    statIconBg: {
      width: theme.iconSize.md,
      height: theme.iconSize.md,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.sm,
    },
    statValue: {
      fontSize: theme.typography.sizes.lg,
      fontFamily: theme.typography.families.bold,
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },
  });