import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/light";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 16,
      paddingHorizontal: 20,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  });
