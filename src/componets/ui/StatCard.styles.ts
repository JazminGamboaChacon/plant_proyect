import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/light";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      alignItems: "center",
      paddingVertical: 14,
    },
    statIconBg: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.textDark,
      marginBottom: 2,
    },
    statLabel: { fontSize: 12, color: theme.colors.textMid },
  });
