import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/light";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    badge: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      gap: 6,
      borderWidth: 1,
    },
    badgeEarned: {
      backgroundColor: theme.colors.greenLight,
      borderColor: "rgba(57,121,73,0.3)",
    },
    badgeLocked: {
      backgroundColor: theme.colors.greenSoft,
      borderColor: theme.colors.border,
      opacity: 0.5,
    },
    badgeLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: theme.colors.textDark,
    },
    badgeLabelLocked: { color: theme.colors.textMid },
  });
