import { ColorSchemeName, useColorScheme } from "react-native";
import { darkColors, lightColors } from "./tokens/colors";
import { AppTheme, ThemeIconSize, ThemeMode, ThemeRadius, ThemeSpacing } from "./tokens/types";
import { typography } from "./tokens/typography";

export type { AppTheme };

const spacing: ThemeSpacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const radius: ThemeRadius = { sm: 4, md: 8, lg: 16, xl: 24, full: 9999 };
const iconSize: ThemeIconSize = { xs: 13, sm: 14, md: 16, lg: 20, xl: 22 };

const theme: Record<ThemeMode, AppTheme> = {
  light: { mode: "light", colors: lightColors, spacing, radius, typography, iconSize },
  dark: { mode: "dark", colors: darkColors, spacing, radius, typography, iconSize },
};

export function getAppTheme(mode: ColorSchemeName): AppTheme {
  return mode === "dark" ? theme.dark : theme.light;
}

export function useAppTheme(): AppTheme {
  return getAppTheme(useColorScheme());
}
