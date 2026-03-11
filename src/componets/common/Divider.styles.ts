import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
  });
