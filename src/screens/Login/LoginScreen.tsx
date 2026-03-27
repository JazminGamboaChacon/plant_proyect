import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./LoginScreen.styles";

export default function LoginScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Ionicons name="leaf" size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.appName}>Bloomly</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.welcomeTitle}>Welcome to Bloomly</Text>
          <Text style={styles.subtitle}>
            Sign in to manage your garden
          </Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={signInWithGoogle}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Continuar con Google"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#4285F4" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
