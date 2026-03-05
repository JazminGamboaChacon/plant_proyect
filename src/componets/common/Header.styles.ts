import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/light";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    placeholder: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.border,
    },
    icons: { flexDirection: "row", gap: 8 },
    iconBtn: { padding: 4 },
  });
