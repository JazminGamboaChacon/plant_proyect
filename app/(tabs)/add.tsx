import { Feather } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { useState } from "react";
import { usePlantStorage } from "../../src/hooks/usePlantStorage";
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlantIdentificationModal from "../../src/componets/PlantIdentificationModal";
import { useTheme } from "../../src/context/ThemeContext";
import { useCamera } from "../../src/hooks/useCamera";
import { PhotoResult } from "../../src/services/cameraService";
import {
  identifyPlant,
  PlantIdentificationResult,
} from "../../src/services/plantIdService";

export default function AddScreen() {
  const { theme } = useTheme();
  const { savePlant } = usePlantStorage("user-1");
  const {
    cameraRef,
    permissions,
    isPermissionGranted,
    isLoadingPermissions,
    cameraCanAskAgain,
    facing,
    flashMode,
    requestPermissions,
    takePhoto,
    toggleFacing,
    toggleFlash,
  } = useCamera({ requestOnMount: true });

  const [capturedPhoto, setCapturedPhoto] = useState<PhotoResult | null>(null);
  const [identificationResult, setIdentificationResult] =
    useState<PlantIdentificationResult | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationError, setIdentificationError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleCapture = async () => {
    const photo = await takePhoto({ quality: 0.8 });
    if (!photo) return;
    setCapturedPhoto(photo);
    setIdentificationResult(null);
    setIdentificationError(null);
    setShowModal(true);
    setIsIdentifying(true);
    try {
      const result = await identifyPlant(photo.uri);
      setIdentificationResult(result);
    } catch (err) {
      setIdentificationError(
        err instanceof Error ? err.message : "Error al identificar la planta"
      );
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleRetake = () => {
    setShowModal(false);
    setCapturedPhoto(null);
    setIdentificationResult(null);
    setIdentificationError(null);
  };

  const handleSavePlant = async (result: PlantIdentificationResult) => {
    if (!capturedPhoto) return;
    await savePlant(
      {
        userId: "user-1",
        commonName: result.commonName || "Planta desconocida",
        scientificName: result.scientificName || "",
        photoURL: null,
        type: "unknown",
        groupId: "",
        isFavorite: false,
        notes: `Riego: ${result.watering}\nLuz: ${result.sunlight}\nSustrato: ${result.soil}`,
        confidence: result.confidence,
        watering: result.watering,
        sunlight: result.sunlight,
        soil: result.soil,
        createdAt: new Date().toISOString(),
      },
      capturedPhoto.uri
    );
    setShowModal(false);
    setCapturedPhoto(null);
  };

  if (isLoadingPermissions) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isPermissionGranted) {
    const permanentlyDenied =
      permissions?.camera.status === "denied" && !cameraCanAskAgain;

    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Feather name="camera-off" size={48} color={theme.colors.textSecondary} />
        <Text style={[styles.permissionText, { color: theme.colors.textPrimary }]}>
          {permanentlyDenied
            ? "Permiso de cámara denegado permanentemente. Actívalo en Configuración."
            : "Se necesita permiso de cámara y galería para escanear plantas."}
        </Text>
        <TouchableOpacity
          style={[styles.permissionBtn, { backgroundColor: theme.colors.primary }]}
          onPress={permanentlyDenied ? () => Linking.openSettings() : requestPermissions}
        >
          <Text style={styles.permissionBtnText}>
            {permanentlyDenied ? "Abrir Configuración" : "Permitir Cámara"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <PlantIdentificationModal
        visible={showModal}
        photoUri={capturedPhoto?.uri ?? null}
        result={identificationResult}
        isLoading={isIdentifying}
        error={identificationError}
        onSave={handleSavePlant}
        onRetake={handleRetake}
      />
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
});
