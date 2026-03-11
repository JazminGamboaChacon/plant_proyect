import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAppTheme } from "../theme/desingSystem";
import { AppTheme } from "../theme/tokens/types";

type ThemeContextType = {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
};

const lightTheme = getAppTheme("light");
const darkTheme = getAppTheme("dark");

const THEME_STORAGE_KEY = "@app_theme_mode";

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark");
        }
      } catch (error) {
        console.warn("Error loading theme preference:", error);
      } finally {
        setIsHydrated(true);
      }
    };
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (isHydrated) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light").catch(
        (error) => console.warn("Error saving theme preference:", error),
      );
    }
  }, [isDark, isHydrated]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
