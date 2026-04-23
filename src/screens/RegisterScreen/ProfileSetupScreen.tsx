import { Feather, Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useCamera } from "../../hooks/useCamera";
import { createStyles } from "./ProfileSetupScreen.styles";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const {
    cameraRef,
    isPermissionGranted,
    facing,
    flashMode,
    requestPermissions,
    takePhoto,
    toggleFacing,
    toggleFlash,
  } = useCamera({ requestOnMount: false });

  const handleCameraPress = async () => {
    if (!isPermissionGranted) {
      await requestPermissions();
    }
    setShowCamera(true);
  };

  const handleCapture = async () => {
    const photo = await takePhoto({ quality: 0.8 });
    if (photo) {
      setAvatarUri(photo.uri);
      setShowCamera(false);
    }
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
              <View style={[styles.avatarCircle, avatarUri ? { borderStyle: "solid" } : null]}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: 76, height: 76, borderRadius: 38 }}
                  />
                ) : (
                  <Feather name="camera" size={28} color={theme.colors.primary} />
                )}
              </View>
              <TouchableOpacity
                style={styles.avatarEditButton}
                onPress={handleCameraPress}
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

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide" statusBarTranslucent>
        {isPermissionGranted ? (
          <View style={{ flex: 1, backgroundColor: "#000" }}>
            <CameraView
              ref={cameraRef as React.RefObject<CameraView>}
              style={{ flex: 1 }}
              facing={facing}
              flash={flashMode}
            >
              <SafeAreaView style={cameraStyles.overlay}>
                <TouchableOpacity
                  onPress={() => setShowCamera(false)}
                  style={cameraStyles.closeBtn}
                >
                  <Feather name="x" size={28} color="#fff" />
                </TouchableOpacity>
                <View style={cameraStyles.controls}>
                  <TouchableOpacity onPress={toggleFlash} style={cameraStyles.sideBtn}>
                    <Feather
                      name={flashMode === "off" ? "zap-off" : "zap"}
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCapture}
                    style={cameraStyles.captureBtn}
                  />
                  <TouchableOpacity onPress={toggleFacing} style={cameraStyles.sideBtn}>
                    <Feather name="refresh-cw" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </CameraView>
          </View>
        ) : (
          <View style={cameraStyles.permissionView}>
            <Feather name="camera-off" size={48} color="#888" />
            <Text style={cameraStyles.permissionText}>
              Se necesita permiso de cámara
            </Text>
            <TouchableOpacity
              onPress={requestPermissions}
              style={cameraStyles.permissionBtn}
            >
              <Text style={{ color: "#fff" }}>Otorgar permisos</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const cameraStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  closeBtn: {
    alignSelf: "flex-end",
    margin: 16,
    padding: 8,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
  sideBtn: {
    padding: 12,
  },
  permissionView: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
  },
  permissionBtn: {
    marginTop: 24,
    backgroundColor: "#333",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
