import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { GrowingBranch } from "../../components/GrowingBranch";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useRegistration } from "../../context/RegistrationContext";
import { useTheme } from "../../context/ThemeContext";
import { registerUser } from "../../services/api";
import { createStyles } from "./PreferencesScreen.styles";

const PLANT_TYPES = [
  { id: "succulents", label: "Suculentas", icon: "flower-tulip", color: "#E67E22" },
  { id: "tropical",   label: "Tropicales", icon: "palm-tree",    color: "#27AE60" },
  { id: "flowering",  label: "Flores",     icon: "flower",       color: "#E91E63" },
  { id: "herbs",      label: "Hierbas",    icon: "leaf",         color: "#8BC34A" },
  { id: "cacti",      label: "Cactus",     icon: "cactus",       color: "#F39C12" },
  { id: "ferns",      label: "Helechos",   icon: "sprout",       color: "#1ABC9C" },
];

function PlantIcon({ icon, color }: { icon: string; color: string }) {
  return <MaterialCommunityIcons name={icon as any} size={32} color={color} />;
}

export default function PreferencesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { data, clearData } = useRegistration();
  const { signInFromRegistration } = useAuth();

  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePlant = (id: string) => {
    setSelectedPlants((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const handleCreateAccount = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        username: data.username,
        birthday: data.birthday,
        favoritePlantTypes: selectedPlants,
        photoBase64: data.photoBase64 || undefined,
        bio: data.bio || undefined,
      });
      await signInFromRegistration(response.user, response.token);
      clearData();
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message ?? "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.branchesContainer} pointerEvents="none">
        <GrowingBranch icon="flower-outline" iconColor="#4CAF50" stemColor="#388E3C" stemHeight={75} iconSize={22} delay={500}  cycleDuration={4800} style={{ top: 30,  left: -5 }} />
        <GrowingBranch icon="sprout"         iconColor="#2E7D32" stemColor="#1B5E20" stemHeight={60} iconSize={20} delay={1900} cycleDuration={4000} style={{ top: 50,  right: -4 }} />
        <GrowingBranch icon="leaf"           iconColor="#81C784" stemColor="#4CAF50" stemHeight={85} iconSize={24} delay={1100} cycleDuration={5100} style={{ bottom: 85, left: 12 }} />
        <GrowingBranch icon="sprout"         iconColor="#388E3C" stemColor="#2E7D32" stemHeight={58} iconSize={18} delay={2800} cycleDuration={4300} style={{ bottom: 60, right: 6 }} />
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <MaterialCommunityIcons name="flower" size={38} color="#fff" />
            </View>
            <Text style={styles.appName}>Bloomly</Text>
          </View>

          {/* Stepper */}
          <View style={styles.stepsContainer}>
            <View style={styles.stepCompleted}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <View style={[styles.stepLine, { backgroundColor: theme.colors.primary }]} />
            <View style={styles.stepCompleted}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <View style={[styles.stepLine, { backgroundColor: theme.colors.primary }]} />
            <View style={styles.stepActive}>
              <Ionicons name="notifications" size={14} color="#F6F9F6" />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Tus preferencias</Text>
            <Text style={styles.subtitle}>Personaliza tu experiencia</Text>

            {error ? (
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#D32F2F", textAlign: "center" }}>
                {error}
              </Text>
            ) : null}

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Tipos de plantas favoritas</Text>
              <View style={styles.plantGrid}>
                {PLANT_TYPES.map((plant) => {
                  const isSelected = selectedPlants.includes(plant.id);
                  return (
                    <TouchableOpacity
                      key={plant.id}
                      style={[
                        styles.plantCard,
                        isSelected
                          ? { backgroundColor: plant.color + "22", borderColor: plant.color }
                          : null,
                      ]}
                      onPress={() => togglePlant(plant.id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <PlantIcon
                        icon={plant.icon}
                        color={isSelected ? plant.color : plant.color + "88"}
                      />
                      <Text style={[styles.plantLabel, isSelected && { color: plant.color, fontFamily: "Inter_500Medium" }]}>
                        {plant.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
                <Feather name="chevron-left" size={16} color={theme.colors.textPrimary} />
                <Text style={styles.backText}>Volver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateAccount}
                style={[styles.createButton, isLoading && { opacity: 0.6 }]}
                disabled={isLoading}
                accessibilityRole="button"
              >
                {isLoading
                  ? <ActivityIndicator size="small" color="#F6F9F6" />
                  : <Text style={styles.createText}>Crear cuenta</Text>
                }
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signInRow}>
            <Text style={styles.signInText}>¿Ya tienes un jardín? </Text>
            <TouchableOpacity onPress={() => router.replace("/")} accessibilityRole="button">
              <Text style={styles.signInLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
