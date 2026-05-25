import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSync } from "../../src/context/SyncContext";
import { useTheme } from "../../src/context/ThemeContext";

export default function TabLayout() {
  const { theme } = useTheme();
  const { pendingCount } = useSync();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 68,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.xs,
          fontFamily: theme.typography.families.medium,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home-outline"
              size={theme.iconSize.xl}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="search-outline"
              size={theme.iconSize.xl}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Agregar",
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={{ flex: 1, alignItems: "center", justifyContent: "center", top: -18 }}
            >
              <View style={styles.addBtn}>
                <Ionicons name="add" size={30} color="#fff" />
                {pendingCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                    <Text style={styles.badgeText}>
                      {pendingCount > 9 ? "9+" : String(pendingCount)}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alertas",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="notifications-outline"
              size={theme.iconSize.xl}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-outline"
              size={theme.iconSize.xl}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#4A8A6A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
});
