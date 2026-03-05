import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/light";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    categoryBtn: {
      width: 90,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      alignItems: "center",
      paddingVertical: 12,
    },
    categoryIconBg: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.greenPale,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    categoryName: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.textDark,
      marginBottom: 2,
      textAlign: "center",
    },
    categoryCount: { fontSize: 12, color: theme.colors.textMid },
  });
