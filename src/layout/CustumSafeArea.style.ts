import { StyleSheet } from "react-native";
import { AppTheme, getAppTheme, useAppTheme } from "../theme/desingSystem";

export const createUserStyle = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
  });

const styleByMode = {
  light: createUserStyle(getAppTheme("light")),
  dark: createUserStyle(getAppTheme("dark")),
};

export function useProfileTheme() {
  const theme = useAppTheme();
  return { theme, styles: styleByMode[theme.mode] };
}
