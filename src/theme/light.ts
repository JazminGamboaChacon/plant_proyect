import { lightColors } from "./colors";
import { FONTS } from "./fonts";

export const lightTheme = {
  dark: false,
  colors: lightColors,
  fonts: FONTS,
};

export type AppTheme = typeof lightTheme;