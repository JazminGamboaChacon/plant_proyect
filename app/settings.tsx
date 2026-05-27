import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../src/context/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const t = theme.colors;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: t.surface,
            borderWidth: 1,
            borderColor: t.border,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name="arrow-left" size={20} color={t.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: t.textPrimary,
          }}
        >
          Configuración
        </Text>
      </View>

      {/* Options */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.push("/edit-profile" as any)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: t.surface,
            borderRadius: 16,
            paddingVertical: 18,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: t.border,
            gap: 14,
          }}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: t.primarySoft,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="edit-2" size={18} color={t.primary} />
          </View>
          <Text style={{ flex: 1, fontSize: 16, fontWeight: "500", color: t.textPrimary }}>
            Editar Perfil
          </Text>
          <Feather name="chevron-right" size={18} color={t.textSecondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
