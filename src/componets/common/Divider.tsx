import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./Divider.styles";

export default function Divider() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Ionicons name="leaf-outline" size={theme.iconSize.sm} color={theme.colors.border} />
      <View style={styles.dividerLine} />
    </View>
  );
}
