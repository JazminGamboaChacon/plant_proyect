import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  icon: string;
  label: string;
  value: string;
  accentColor: string;
};

export default function ProfileInfoCard({ icon, label, value, accentColor }: Props) {
  const { theme } = useTheme();
  const t = theme.colors;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: t.surface,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        gap: 14,
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {/* Ícono izquierdo */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: accentColor + "22",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name={icon as any} size={22} color={accentColor} />
      </View>

      {/* Texto */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 12, fontWeight: "500", color: accentColor }}>
          {label}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "500", color: t.textPrimary }}>
          {value}
        </Text>
      </View>

      {/* Ícono decorativo derecho */}
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: accentColor,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name="flower" size={16} color="#fff" />
      </View>
    </View>
  );
}
