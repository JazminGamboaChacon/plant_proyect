export type ThemeMode = "light" | "dark";

export interface ThemeColors {
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

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ThemeTypography {
  families: {
    regular: string;
    medium: string;
    bold: string;
    scientific: string;
  };
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export interface ThemeIconSize {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
  iconSize: ThemeIconSize;
}
