import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    placeholder: {
      width: theme.iconSize.md,
      height: theme.iconSize.md,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.border,
    },
    icons: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    iconBtn: {
      padding: theme.spacing.xs,
    },
  });