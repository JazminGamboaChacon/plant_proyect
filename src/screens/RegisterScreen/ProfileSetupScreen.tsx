import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { GrowingBranch } from "../../components/GrowingBranch";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegistration } from "../../context/RegistrationContext";
import { useTheme } from "../../context/ThemeContext";
import { useCamera } from "../../hooks/useCamera";
import { createStyles } from "./ProfileSetupScreen.styles";

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function parseBirthday(value: string): Date {
  if (value && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [d, m, y] = value.split("/");
    const parsed = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date(2000, 0, 1);
}

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { data, updateData } = useRegistration();

  const [fullName, setFullName] = useState(data.fullName);
  const [username, setUsername] = useState(data.username || data.email.split("@")[0]);
  const [birthday, setBirthday] = useState(data.birthday);
  const [photoBase64, setPhotoBase64] = useState(data.photoBase64);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(parseBirthday(data.birthday));
  const [error, setError] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.3,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      setPhotoBase64(result.assets[0].base64);
    }
  };

  const handleContinue = () => {
    setError("");
    if (!fullName.trim()) {
      setError("Ingresa tu nombre completo");
      return;
    }
    if (!username.trim()) {
      setError("Ingresa un nombre de usuario");
      return;
    }
    updateData({ fullName: fullName.trim(), username: username.trim(), birthday, photoBase64 });
    router.push("/preference");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.branchesContainer} pointerEvents="none">
        <GrowingBranch icon="leaf"           iconColor="#388E3C" stemColor="#2E7D32" stemHeight={65} iconSize={20} delay={300}  cycleDuration={4600} style={{ top: 25,  left: -4 }} />
        <GrowingBranch icon="sprout"         iconColor="#43A047" stemColor="#388E3C" stemHeight={80} iconSize={24} delay={1700} cycleDuration={3900} style={{ top: 55,  right: -6 }} />
        <GrowingBranch icon="flower-outline" iconColor="#66BB6A" stemColor="#4CAF50" stemHeight={55} iconSize={18} delay={900}  cycleDuration={5200} style={{ bottom: 90, left: 8 }} />
        <GrowingBranch icon="leaf"           iconColor="#1B5E20" stemColor="#2E7D32" stemHeight={70} iconSize={22} delay={2500} cycleDuration={4100} style={{ bottom: 65, right: 5 }} />
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
            <View style={styles.stepActive}>
              <Ionicons name="leaf" size={14} color="#F6F9F6" />
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepPending}>
              <Ionicons name="notifications-outline" size={14} color={theme.colors.textSecondary} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Cuéntanos sobre ti</Text>
            <Text style={styles.subtitle}>Configura tu perfil de jardín</Text>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={pickImage}
                accessibilityRole="button"
                accessibilityLabel="Cambiar foto"
              >
                {photoBase64 ? (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Feather name="camera" size={28} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatarEditButton}
                onPress={pickImage}
                accessibilityRole="button"
              >
                <Feather name="camera" size={12} color="#F6F9F6" />
              </TouchableOpacity>
            </View>

            {error ? (
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#D32F2F", textAlign: "center" }}>
                {error}
              </Text>
            ) : null}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={(t) => { setFullName(t); setError(""); }}
                  placeholder="Tu nombre completo"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nombre de usuario</Text>
              <View style={styles.inputWrapper}>
                <Feather name="at-sign" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={(t) => { setUsername(t); setError(""); }}
                  placeholder="tu_usuario"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Fecha de nacimiento</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowDatePicker(true)}
                accessibilityRole="button"
              >
                <Feather name="calendar" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <Text style={[styles.birthdayText, !birthday && { color: theme.colors.textSecondary }]}>
                  {birthday || "dd/mm/aaaa"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setSelectedDate(date);
                      setBirthday(formatDate(date));
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
                <Feather name="chevron-left" size={16} color={theme.colors.textPrimary} />
                <Text style={styles.backText}>Volver</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleContinue} style={styles.continueButton} accessibilityRole="button">
                <Text style={styles.continueText}>Continuar</Text>
                <Feather name="chevron-right" size={16} color="#F6F9F6" />
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
