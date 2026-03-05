import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/light";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    navbar: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    navItem: { flex: 1, alignItems: "center", paddingVertical: 4 },
    navLabel: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.colors.textMid,
      marginTop: 2,
    },
    navLabelActive: { color: theme.colors.green },
    navDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.green,
      marginTop: 2,
    },
  });
