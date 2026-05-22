import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./Header.styles";

export default function Header() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();
  const styles = createStyles(theme);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

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
        <TouchableOpacity style={styles.iconBtn} onPress={handleSignOut}>
          <Feather
            name="log-out"
            size={theme.iconSize.lg}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
