import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Achievement } from "../../types-dtos/user.types";
import { createStyles } from "./AchievementBadge.styles";

export default function AchievementBadge({
  iconName,
  label,
  earned,
}: Achievement) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View
      style={[styles.badge, earned ? styles.badgeEarned : styles.badgeLocked]}
    >
      <Ionicons
        name={iconName}
        size={13}
        color={earned ? theme.colors.green : theme.colors.textMid}
      />
      <Text style={[styles.badgeLabel, !earned && styles.badgeLabelLocked]}>
        {label}
      </Text>
    </View>
  );
}
