import { Feather } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/context/ThemeContext";
import { useCamera } from "../../src/hooks/useCamera";
import { PhotoResult } from "../../src/services/cameraService";

export default function AddScreen() {
  const { theme } = useTheme();
  const {
    cameraRef,
    permissions,
    isPermissionGranted,
    isLoadingPermissions,
    error,
    facing,
    flashMode,
    requestPermissions,
    takePhoto,
    toggleFacing,
    toggleFlash,
    saveToGallery,
  } = useCamera({ requestOnMount: true });

  const [capturedPhoto, setCapturedPhoto] = useState<PhotoResult | null>(null);

  const handleCapture = async () => {
    const photo = await takePhoto({ quality: 0.8 });
    if (photo) setCapturedPhoto(photo);
  };

  const handleSave = async () => {
    if (capturedPhoto) {
      await saveToGallery(capturedPhoto.uri);
      setCapturedPhoto(null);
    }
  };

  if (isLoadingPermissions) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isPermissionGranted) {
    const isDenied = permissions?.camera === "denied" || permissions?.mediaLibrary === "denied";
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: "red", fontSize: 11, marginBottom: 8 }}>
          cam: {permissions?.camera ?? "null"} | media: {permissions?.mediaLibrary ?? "null"} | err: {error ?? "none"}
        </Text>
        <Feather name="camera-off" size={48} color={theme.colors.textSecondary} />
        <Text style={[styles.permissionText, { color: theme.colors.textPrimary }]}>
          {isDenied
            ? "Permiso denegado. Actívalo manualmente en Configuración."
            : "Se necesita permiso de cámara y galería."}
        </Text>
        <TouchableOpacity
          style={[styles.permissionBtn, { backgroundColor: theme.colors.primary }]}
          onPress={isDenied ? () => Linking.openSettings() : requestPermissions}
        >
          <Text style={styles.permissionBtnText}>
            {isDenied ? "Abrir Configuración" : "Otorgar permisos"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedPhoto) {
    return (
      <View style={styles.fill}>
        <Image source={{ uri: capturedPhoto.uri }} style={styles.fill} />
        <SafeAreaView style={styles.previewOverlay}>
          <View style={styles.previewButtons}>
            <TouchableOpacity
              onPress={() => setCapturedPhoto(null)}
              style={styles.previewBtn}
            >
              <Feather name="x" size={22} color="#fff" />
              <Text style={styles.previewBtnText}>Retomar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.previewBtn, styles.saveBtn]}
            >
              <Feather name="download" size={22} color="#fff" />
              <Text style={styles.previewBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <CameraView
        ref={cameraRef as React.RefObject<CameraView>}
        style={styles.fill}
        facing={facing}
        flash={flashMode}
      >
        <SafeAreaView style={styles.cameraOverlay}>
          <View style={styles.topControls}>
            <TouchableOpacity onPress={toggleFlash} style={styles.iconBtn}>
              <Feather
                name={flashMode === "off" ? "zap-off" : "zap"}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomControls}>
            <View style={styles.sideSlot} />
            <TouchableOpacity onPress={handleCapture} style={styles.captureBtn} />
            <TouchableOpacity onPress={toggleFacing} style={styles.sideSlot}>
              <Feather name="refresh-cw" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 32,
  },
  permissionBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  permissionBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  iconBtn: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 24,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 32,
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
  sideSlot: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  previewOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  previewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  saveBtn: {
    backgroundColor: "rgba(56,142,60,0.85)",
  },
  previewBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
