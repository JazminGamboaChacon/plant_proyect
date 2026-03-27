import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./PreferencesScreen.styles";

const PLANT_TYPES = [
  { id: "succulents", label: "Succulents", icon: "cactus", lib: "material" },
  { id: "tropical",   label: "Tropical",   icon: "palm-tree", lib: "material" },
  { id: "flowering",  label: "Flowering",  icon: "flower",    lib: "material" },
  { id: "herbs",      label: "Herbs",      icon: "leaf",      lib: "ionicons" },
  { id: "cacti",      label: "Cacti",      icon: "cactus",    lib: "material" },
  { id: "ferns",      label: "Ferns",      icon: "sprout",    lib: "material" },
];

type PlantIconProps = {
  lib: string;
  icon: string;
  color: string;
};

function PlantIcon({ lib, icon, color }: PlantIconProps) {
  if (lib === "ionicons") {
    return <Ionicons name={icon as any} size={28} color={color} />;
  }
  return <MaterialCommunityIcons name={icon as any} size={28} color={color} />;
}

export default function PreferencesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [publicProfile, setPublicProfile] = useState(true);

  const togglePlant = (id: string) => {
    setSelectedPlants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="leaf" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.appName}>Bloomly</Text>
          </View>

          {/* Pasos */}
          <View style={styles.stepsContainer}>
            <View style={styles.stepCompleted}>
              <Ionicons name="leaf-outline" size={16} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepCompleted}>
              <Ionicons name="leaf-outline" size={16} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepActive}>
              <Ionicons name="notifications" size={16} color="#F6F9F6" />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Your preferences</Text>
            <Text style={styles.subtitle}>Customize your experience</Text>

            {/* Favorite plant types */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Favorite plant types</Text>
              <View style={styles.plantGrid}>
                {PLANT_TYPES.map((plant) => {
                  const isSelected = selectedPlants.includes(plant.id);
                  const iconColor = isSelected
                    ? theme.colors.primary
                    : theme.colors.textSecondary;
                  return (
                    <TouchableOpacity
                      key={plant.id}
                      style={[
                        styles.plantCard,
                        isSelected && styles.plantCardSelected,
                      ]}
                      onPress={() => togglePlant(plant.id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`Tipo de planta: ${plant.label}`}
                    >
                      <PlantIcon
                        lib={plant.lib}
                        icon={plant.icon}
                        color={iconColor}
                      />
                      <Text
                        style={[
                          styles.plantLabel,
                          isSelected && styles.plantLabelSelected,
                        ]}
                      >
                        {plant.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Public profile toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color={theme.colors.primary}
                  style={styles.toggleIcon}
                />
                <View>
                  <Text style={styles.toggleTitle}>Public profile</Text>
                  <Text style={styles.toggleSubtitle}>Anyone can see your garden</Text>
                </View>
              </View>
              <Switch
                value={publicProfile}
                onValueChange={setPublicProfile}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor="#F6F9F6"
                accessibilityLabel="Perfil público"
                accessibilityRole="switch"
                accessibilityState={{ checked: publicProfile }}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Regresar"
              >
                <Feather name="chevron-left" size={16} color={theme.colors.textPrimary} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createButton}
                accessibilityRole="button"
                accessibilityLabel="Crear cuenta"
              >
                <Text style={styles.createText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign in link */}
          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already have a garden? </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión"
            >
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}