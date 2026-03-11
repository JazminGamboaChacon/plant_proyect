import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    categoryBtn: {
      width: 90,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
    },
    categoryIconBg: {
      width: theme.iconSize.lg,
      height: theme.iconSize.lg,
      borderRadius: theme.radius.full,
      overflow: "hidden",
      marginBottom: theme.spacing.xs,
    },
    categoryImage: {
      width: "100%",
      height: "100%",
    },
    categoryName: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.medium,
      color: theme.colors.textPrimary,
      marginBottom: 2,
      textAlign: "center",
    },
    categoryCount: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },
  });