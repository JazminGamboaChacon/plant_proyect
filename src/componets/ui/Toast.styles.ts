import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 50,
      left: theme.spacing.md,
      right: theme.spacing.md,
      zIndex: 9999,
    },
    toast: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + 4,
      borderRadius: theme.radius.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 6,
    },
    success: {
      backgroundColor: theme.colors.success,
    },
    error: {
      backgroundColor: theme.colors.error,
    },
    info: {
      backgroundColor: theme.colors.primary,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    message: {
      flex: 1,
      fontFamily: theme.typography.families.medium,
      fontSize: theme.typography.sizes.sm,
      color: "#FFFFFF",
    },
    closeButton: {
      padding: 4,
      marginLeft: theme.spacing.sm,
    },
  });
