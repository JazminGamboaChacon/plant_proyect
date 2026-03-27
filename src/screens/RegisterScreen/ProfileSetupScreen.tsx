import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./ProfileSetupScreen.styles";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");

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
              <Ionicons
                name="leaf-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepActive}>
              <Ionicons name="leaf" size={16} color="#F6F9F6" />
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepPending}>
              <Ionicons
                name="notifications-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Tell us about yourself</Text>
            <Text style={styles.subtitle}>Set up your garden profile</Text>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Feather name="camera" size={28} color={theme.colors.primary} />
              </View>
              <TouchableOpacity
                style={styles.avatarEditButton}
                accessibilityRole="button"
                accessibilityLabel="Cambiar foto de perfil"
              >
                <Feather name="camera" size={12} color="#F6F9F6" />
              </TouchableOpacity>
            </View>

            {/* Full Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Feather
                  name="user"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Tu nombre completo"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoCapitalize="words"
                  autoCorrect={false}
                  accessibilityLabel="Campo de nombre completo"
                />
              </View>
            </View>

            {/* Username */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <Feather
                  name="at-sign"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="tu_usuario"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Campo de nombre de usuario"
                />
              </View>
            </View>

            {/* Birthday */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Birthday</Text>
              <View style={styles.inputWrapper}>
                <Feather
                  name="calendar"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={birthday}
                  onChangeText={setBirthday}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                  accessibilityLabel="Campo de fecha de nacimiento"
                />
              </View>
            </View>

            {/* Botones Back y Continue */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Regresar"
              >
                <Feather
                  name="chevron-left"
                  size={16}
                  color={theme.colors.textPrimary}
                />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/preference")}
                style={styles.continueButton}
                accessibilityRole="button"
                accessibilityLabel="Continuar"
              >
                <Text style={styles.continueText}>Continue</Text>
                <Feather name="chevron-right" size={16} color="#F6F9F6" />
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
