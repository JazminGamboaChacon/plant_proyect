import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { NavItem } from "../../types-dtos/user.types";
import { createStyles } from "./TabBar.styles";

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    active: false,
    iconOutline: "home-outline",
    iconFilled: "home",
  },
  {
    label: "Explore",
    active: false,
    iconOutline: "search-outline",
    iconFilled: "search",
  },
  {
    label: "Add",
    active: false,
    iconOutline: "add-circle-outline",
    iconFilled: "add-circle",
  },
  {
    label: "Alerts",
    active: false,
    iconOutline: "notifications-outline",
    iconFilled: "notifications",
  },
  {
    label: "Profile",
    active: true,
    iconOutline: "person-outline",
    iconFilled: "person",
  },
];

export default function TabBar() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.navbar}>
      {NAV_ITEMS.map((item) => (
        <TouchableOpacity key={item.label} style={styles.navItem}>
          <Ionicons
            name={item.active ? item.iconFilled : item.iconOutline}
            size={20}
            color={item.active ? theme.colors.green : theme.colors.textMid}
          />
          <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
            {item.label}
          </Text>
          {item.active && <View style={styles.navDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}
