import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./Header.styles";

export default function Header() {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <View style={styles.placeholder} />
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme}>
          <Feather
            name={isDark ? "sun" : "moon"}
            size={theme.iconSize.lg}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather
            name="settings"
            size={theme.iconSize.lg}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather
            name="more-horizontal"
            size={theme.iconSize.lg}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
