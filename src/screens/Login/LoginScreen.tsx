import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./LoginScreen.styles";

interface SwayingBranchProps {
  flowerIcon: string;
  flowerColor: string;
  stemColor: string;
  stemHeight: number;
  flowerSize: number;
  delay: number;
  maxAngle: number;
  bottom: number;
  left?: number;
  right?: number;
}

function SwayingBranch({
  flowerIcon, flowerColor, stemColor,
  stemHeight, flowerSize, delay, maxAngle,
  bottom, left, right,
}: SwayingBranchProps) {
  const angle = useSharedValue(maxAngle * 0.5);
  const totalHeight = stemHeight + flowerSize;

  useEffect(() => {
    angle.value = withRepeat(
      withSequence(
        withTiming(-maxAngle, { duration: 2600 + delay, easing: Easing.inOut(Easing.sin) }),
        withTiming(maxAngle,  { duration: 2600 + delay, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: totalHeight / 2 },
      { rotate: `${angle.value}deg` },
      { translateY: -(totalHeight / 2) },
    ],
  }));

  return (
    <Animated.View
      style={[
        { position: "absolute", bottom, left, right, alignItems: "center", height: totalHeight },
        animatedStyle,
      ]}
    >
      <MaterialCommunityIcons name={flowerIcon as any} size={flowerSize} color={flowerColor} />
      <View style={{ width: 2.5, flex: 1, backgroundColor: stemColor, borderRadius: 2 }} />
    </Animated.View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const styles = createStyles(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Ingresa un email válido");
      return;
    }
    if (!password) {
      setError("Ingresa tu contraseña");
      return;
    }
    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      setError(e.message ?? "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.branchesContainer} pointerEvents="none">
        {/* Lado izquierdo */}
        <SwayingBranch flowerIcon="flower"       flowerColor="#FFD700" stemColor="#5D8A5E" stemHeight={140} flowerSize={30} delay={0}   maxAngle={9}  bottom={0} left={-8} />
        <SwayingBranch flowerIcon="flower-tulip" flowerColor="#FF80AB" stemColor="#4CAF50" stemHeight={95}  flowerSize={26} delay={600} maxAngle={12} bottom={0} left={38} />
        <SwayingBranch flowerIcon="sprout"       flowerColor="#8BC34A" stemColor="#388E3C" stemHeight={65}  flowerSize={22} delay={300} maxAngle={10} bottom={0} left={18} />
        {/* Lado derecho */}
        <SwayingBranch flowerIcon="flower"       flowerColor="#FFC107" stemColor="#5D8A5E" stemHeight={120} flowerSize={28} delay={200} maxAngle={8}  bottom={0} right={-5} />
        <SwayingBranch flowerIcon="flower-tulip" flowerColor="#FF6B9D" stemColor="#4CAF50" stemHeight={80}  flowerSize={24} delay={800} maxAngle={11} bottom={0} right={32} />
        <SwayingBranch flowerIcon="leaf"         flowerColor="#1ABC9C" stemColor="#2E7D32" stemHeight={55}  flowerSize={20} delay={500} maxAngle={13} bottom={0} right={15} />
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
            <Text style={styles.subtitle}>Tu jardín digital</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.welcomeTitle}>Bienvenida de vuelta</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.fieldContainer}>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(""); }}
                  placeholder="tu@email.com"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Email"
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(""); }}
                  placeholder="Contraseña"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Contraseña"
                />
                <Pressable onPress={() => setShowPassword((p) => !p)} style={styles.eyeButton} accessibilityRole="button">
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={theme.colors.textSecondary} />
                </Pressable>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotContainer} accessibilityRole="button">
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
              onPress={handleSignIn}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión"
            >
              {isLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.signInText}>Iniciar sesión</Text>
              }
            </TouchableOpacity>
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿Nueva aquí? </Text>
            <TouchableOpacity onPress={() => router.push("/register")} accessibilityRole="button">
              <Text style={styles.registerLink}>Únete al jardín</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
