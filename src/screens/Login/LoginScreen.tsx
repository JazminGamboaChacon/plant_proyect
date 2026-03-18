import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./LoginScreen.styles";

export default function LoginScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="leaf" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.appName}>Bloomly</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.welcomeTitle}>Welcome back</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather
                  name="mail"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Campo de correo electrónico"
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Feather
                  name="lock"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Campo de contraseña"
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  style={styles.eyeButton}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotContainer}
              accessibilityRole="button"
              accessibilityLabel="¿Olvidaste tu contraseña?"
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInButton}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión"
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                accessibilityRole="button"
                accessibilityLabel="Continuar con Google"
              >
                <Ionicons name="logo-google" size={18} color="#4285F4" />
                <Text style={styles.socialText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                accessibilityRole="button"
                accessibilityLabel="Continuar con Apple"
              >
                <Ionicons name="logo-apple" size={18} color={theme.colors.textPrimary} />
                <Text style={styles.socialText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>New here? </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Unirse al jardín"
            >
              <Text style={styles.registerLink}>Join the garden</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}