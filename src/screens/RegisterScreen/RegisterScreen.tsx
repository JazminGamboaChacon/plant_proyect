import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { GrowingBranch } from "../../components/GrowingBranch";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegistration } from "../../context/RegistrationContext";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./RegisterScreen.styles";

const STRENGTH_COLORS = ["#D32F2F", "#F57C00", "#F9A825", "#2E7D32"];
const STRENGTH_LABELS = ["Débil · semilla 🌱", "Creciendo 🌿", "Bien · floreciendo 🌸", "Fuerte · radiante ✨"];

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { updateData } = useRegistration();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const strength = password ? getPasswordStrength(password) : 0;

  const handleContinue = () => {
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Ingresa un email válido");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      setError("Las contraseñas no coinciden");
      return;
    }
    updateData({ email: email.trim(), password });
    router.push("/profile-setup");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.branchesContainer} pointerEvents="none">
        <GrowingBranch icon="sprout"         iconColor="#4CAF50" stemColor="#388E3C" stemHeight={70} iconSize={22} delay={0}    cycleDuration={4200} style={{ top: 30,  left: -6 }} />
        <GrowingBranch icon="leaf"           iconColor="#27AE60" stemColor="#2E7D32" stemHeight={55} iconSize={18} delay={1400} cycleDuration={3800} style={{ top: 60,  right: -4 }} />
        <GrowingBranch icon="flower-outline" iconColor="#8BC34A" stemColor="#558B2F" stemHeight={80} iconSize={24} delay={700}  cycleDuration={5000} style={{ bottom: 80, left: 10 }} />
        <GrowingBranch icon="sprout"         iconColor="#1ABC9C" stemColor="#00796B" stemHeight={60} iconSize={20} delay={2100} cycleDuration={4500} style={{ bottom: 60, right: 8 }} />
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
            <View style={[styles.stepDot, styles.stepActive]} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>Comienza tu aventura con las plantas</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(""); }}
                  placeholder="your@email.com"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(""); }}
                  placeholder="Crea una contraseña"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                />
                <Pressable onPress={() => setShowPassword((p) => !p)} style={styles.eyeButton} accessibilityRole="button">
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={theme.colors.textSecondary} />
                </Pressable>
              </View>

              {/* Strength bar */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthSegments}>
                    {[1, 2, 3, 4].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthSegment,
                          strength >= level && { backgroundColor: STRENGTH_COLORS[strength - 1] },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, strength > 0 && { color: STRENGTH_COLORS[strength - 1] }]}>
                    {strength > 0 ? STRENGTH_LABELS[strength - 1] : ""}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); setError(""); }}
                  placeholder="Confirma tu contraseña"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                />
                <Pressable onPress={() => setShowConfirmPassword((p) => !p)} style={styles.eyeButton} accessibilityRole="button">
                  <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={18} color={theme.colors.textSecondary} />
                </Pressable>
              </View>
            </View>

            <TouchableOpacity onPress={handleContinue} style={styles.continueButton} accessibilityRole="button">
              <Text style={styles.continueText}>Continuar</Text>
              <Feather name="arrow-right" size={16} color="#F6F9F6" />
            </TouchableOpacity>
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
