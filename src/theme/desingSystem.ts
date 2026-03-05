import { ColorSchemeName, useColorScheme } from "react-native";

type ThemeMode = "light" | "dark";

interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  primaryPale: string;
  primarySoft: string;
  peach: string;
  teal: string;
}

interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface ThemeRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
}

const sharedSpacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const sharedRadius: ThemeRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const lightColors: ThemeColors = {
  background: "#F8F7F3", // fondo general
  surface: "#FCFCF9", // fondo de cards
  border: "#DBE5D8", // bordes y dividers
  textPrimary: "#1A2E1E", // títulos y texto principal
  textSecondary: "#57685A", // texto secundario y labels
  primary: "#397949", // verde principal (botones, íconos activos)
  primaryLight: "#BCE3C3", // verde claro (badges earned, bioIconBg)
  primaryPale: "#DCF2E3", // verde pálido (fondo categoryIconBg, progressBg)
  primarySoft: "#E9F1E8", // verde suave (badges locked)
  peach: "#E9D4BC", // fondo ícono streak
  teal: "#A0DEBC", // fondo ícono plants
};

export const darkColors: ThemeColors = {
  background: "#1A2E1E", // fondo general oscuro
  surface: "#243B28", // fondo de cards oscuro
  border: "#397949", // bordes verdes
  textPrimary: "#F8F7F3", // texto claro
  textSecondary: "#DBE5D8", // texto secundario claro
  primary: "#BCE3C3", // verde claro como primario en dark
  primaryLight: "#397949", // verde normal como light en dark
  primaryPale: "#2D4F33", // verde muy oscuro
  primarySoft: "#243B28", // superficie como soft
  peach: "#7A5A3C", // peach oscuro
  teal: "#3A6B52", // teal oscuro
};


const theme: Record<ThemeMode, AppTheme> = {
  light: {
    mode: "light",
    colors: lightColors,
    spacing: sharedSpacing,
    radius: sharedRadius,
    },
    dark: {
    mode: "dark",
    colors: darkColors,
    spacing: sharedSpacing,
    radius: sharedRadius,
  },
};

export function getAppTheme(mode: ColorSchemeName): AppTheme {
    if (mode === "dark") {
        return theme.dark;
    }
    return theme.light;
}

export function useAppTheme(): AppTheme {
    const mode = useColorScheme();
    return getAppTheme(mode);
}

