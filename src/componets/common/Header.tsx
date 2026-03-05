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
            size={20}
            color={theme.colors.textMid}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="settings" size={20} color={theme.colors.textMid} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather
            name="more-horizontal"
            size={20}
            color={theme.colors.textMid}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
