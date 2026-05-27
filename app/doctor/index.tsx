import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraPermissionModal from '../../src/componets/common/CameraPermissionModal';
import CameraPermissionScreen from '../../src/componets/common/CameraPermissionScreen';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { useCamera } from '../../src/hooks/useCamera';
import { PhotoResult } from '../../src/services/cameraService';
import { diagnosePlant, DiagnosisResult } from '../../src/services/plantDoctorService';
import { saveDiagnosis } from '../../src/services/diseaseService';

const CAMERA_PERM_KEY = '@camera_perm_asked';

const SEVERITY_COLOR: Record<string, string> = {
  leve: '#F59E0B',
  moderado: '#EA580C',
  grave: '#DC2626',
};

const TYPE_LABEL: Record<string, string> = {
  enfermedad: 'Enfermedad',
  plaga: 'Plaga',
  deficiencia: 'Deficiencia',
  otro: 'Otro',
};

export default function DoctorScreen() {
  const { theme } = useTheme();
  const t = theme.colors;
  const { user } = useAuth();
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
  } = useCamera({ requestOnMount: false });

  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CAMERA_PERM_KEY).then((val) => {
      if (!val) {
        setShowPermissionModal(true);
        setIsCheckingPermissions(false);
      } else {
        requestPermissions().finally(() => setIsCheckingPermissions(false));
      }
    });
  }, []);

  const handleModalAllow = async () => {
    await AsyncStorage.setItem(CAMERA_PERM_KEY, 'true');
    setShowPermissionModal(false);
    await requestPermissions();
  };

  const handleModalDismiss = async () => {
    await AsyncStorage.setItem(CAMERA_PERM_KEY, 'true');
    setShowPermissionModal(false);
  };

  const [capturedPhoto, setCapturedPhoto] = useState<PhotoResult | null>(null);
  const [capturedBase64, setCapturedBase64] = useState<string | undefined>(undefined);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const runDiagnosis = async (photoUri: string, base64?: string) => {
    setShowModal(true);
    setIsDiagnosing(true);
    setDiagnosisResult(null);
    setDiagnosisError(null);
    try {
      const result = await diagnosePlant(photoUri, base64);
      setDiagnosisResult(result);
    } catch (err) {
      setDiagnosisError(err instanceof Error ? err.message : 'Error al analizar la imagen');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleCapture = async () => {
    const photo = await takePhoto({ quality: 0.8 });
    if (!photo) return;
    let base64 = photo.base64;
    if (!base64) {
      base64 = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
    setCapturedPhoto(photo);
    setCapturedBase64(base64);
    await runDiagnosis(photo.uri, base64);
  };

  const handleGalleryPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.8,
      base64: true,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    let base64 = asset.base64 ?? undefined;
    if (!base64) {
      base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
    setCapturedPhoto({ uri: asset.uri, base64: base64 ?? undefined, width: asset.width, height: asset.height });
    setCapturedBase64(base64);
    await runDiagnosis(asset.uri, base64);
  };

  const handleRetake = () => {
    setShowModal(false);
    setCapturedPhoto(null);
    setCapturedBase64(undefined);
    setDiagnosisResult(null);
    setDiagnosisError(null);
  };

  const handleSave = async () => {
    if (!capturedPhoto || !diagnosisResult) return;
    setIsSaving(true);
    try {
      const userId = user?.id ?? 'user-1';
      await saveDiagnosis(
        userId,
        {
          isHealthy: diagnosisResult.isHealthy,
          name: diagnosisResult.name,
          type: diagnosisResult.type,
          severity: diagnosisResult.severity,
          confidence: diagnosisResult.confidence,
          affectedArea: diagnosisResult.affectedArea,
          description: diagnosisResult.description,
          treatment: diagnosisResult.treatment,
          product: diagnosisResult.product,
        },
        capturedPhoto.uri,
      );
      router.replace('/(tabs)/explore?tab=diseases' as any);
    } finally {
      setIsSaving(false);
    }
  };

  if (isCheckingPermissions || isLoadingPermissions) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (showPermissionModal) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <CameraPermissionModal
          visible={showPermissionModal}
          onAllow={handleModalAllow}
          onDismiss={handleModalDismiss}
        />
      </View>
    );
  }

  if (!isPermissionGranted) {
    const permanentlyDenied = permissions?.camera.status === 'denied' && !cameraCanAskAgain;
    return (
      <CameraPermissionScreen
        permanentlyDenied={permanentlyDenied}
        onAllow={requestPermissions}
        onOpenSettings={() => Linking.openSettings()}
      />
    );
  }

  return (
    <View style={styles.fill}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Diagnosis modal */}
      <Modal visible={showModal} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalSafe, { backgroundColor: t.surface }]}>
          <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>

            {/* Photo preview */}
            {capturedPhoto && (
              <Image source={{ uri: capturedPhoto.uri }} style={styles.modalPhoto} resizeMode="cover" />
            )}

            {/* Loading */}
            {isDiagnosing && (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color={t.primary} />
                <Text style={[styles.loadingText, { color: t.textSecondary }]}>Analizando la planta…</Text>
              </View>
            )}

            {/* Error */}
            {!isDiagnosing && diagnosisError && (
              <View style={styles.modalBody}>
                <Feather name="alert-circle" size={36} color={t.error ?? '#DC2626'} />
                <Text style={styles.errorText}>{diagnosisError}</Text>
              </View>
            )}

            {/* Healthy */}
            {!isDiagnosing && diagnosisResult?.isHealthy && (
              <View style={styles.modalBody}>
                <View style={styles.healthyIcon}>
                  <Feather name="check-circle" size={48} color={t.primary} />
                </View>
                <Text style={styles.healthyTitle}>¡Tu planta está sana!</Text>
                <Text style={[styles.healthySubtitle, { color: t.textSecondary }]}>
                  No se detectaron enfermedades ni plagas visibles.
                </Text>
              </View>
            )}

            {/* Problem found */}
            {!isDiagnosing && diagnosisResult && !diagnosisResult.isHealthy && (
              <View style={styles.modalBody}>
                {/* Header row */}
                <View style={styles.problemHeader}>
                  <Text style={[styles.problemName, { color: t.textPrimary }]}>{diagnosisResult.name}</Text>
                  <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLOR[diagnosisResult.severity] ?? '#888' }]}>
                    <Text style={styles.severityText}>{diagnosisResult.severity}</Text>
                  </View>
                </View>

                {/* Type + confidence */}
                <View style={styles.metaRow}>
                  <View style={[styles.typePill, { backgroundColor: t.primarySoft }]}>
                    <Text style={[styles.typePillText, { color: t.textSecondary }]}>{TYPE_LABEL[diagnosisResult.type] ?? diagnosisResult.type}</Text>
                  </View>
                  <Text style={[styles.confidenceText, { color: t.textSecondary }]}>{diagnosisResult.confidence}% confianza</Text>
                </View>

                {/* Affected area */}
                {diagnosisResult.affectedArea ? (
                  <View style={[styles.infoBlock, { backgroundColor: t.primarySoft }]}>
                    <Text style={[styles.infoLabel, { color: t.textSecondary }]}>Zona afectada</Text>
                    <Text style={[styles.infoText, { color: t.textPrimary }]}>{diagnosisResult.affectedArea}</Text>
                  </View>
                ) : null}

                {/* Description */}
                <View style={[styles.infoBlock, { backgroundColor: t.primarySoft }]}>
                  <Text style={[styles.infoLabel, { color: t.textSecondary }]}>Descripción</Text>
                  <Text style={[styles.infoText, { color: t.textPrimary }]}>{diagnosisResult.description}</Text>
                </View>

                {/* Treatment */}
                <View style={[styles.infoBlock, styles.treatmentBlock, { backgroundColor: t.primaryPale, borderColor: t.primaryLight }]}>
                  <Feather name="activity" size={14} color={t.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.infoLabel, { color: t.textSecondary }]}>Tratamiento</Text>
                    <Text style={[styles.infoText, { color: t.textPrimary }]}>{diagnosisResult.treatment}</Text>
                  </View>
                </View>

                {/* Product recommendation */}
                {diagnosisResult.product ? (
                  <View style={[styles.infoBlock, styles.productBlock]}>
                    <Feather name="shopping-bag" size={14} color="#7C3AED" />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.infoLabel, { color: t.textSecondary }]}>Producto recomendado</Text>
                      <Text style={[styles.infoText, { color: t.textPrimary }]}>{diagnosisResult.product}</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            )}
          </ScrollView>

          {/* Action buttons */}
          <View style={[styles.modalActions, { borderTopColor: t.border }]}>
            <TouchableOpacity onPress={handleRetake} style={[styles.retakeBtn, { borderColor: t.border }]}>
              <Text style={[styles.retakeBtnText, { color: t.textSecondary }]}>Retomar</Text>
            </TouchableOpacity>

            {diagnosisResult && !isDiagnosing && (
              <TouchableOpacity
                onPress={diagnosisResult.isHealthy ? handleRetake : handleSave}
                style={styles.saveBtn}
                disabled={isSaving}
              >
                <LinearGradient
                  colors={['#2D7A4F', '#4CAF50']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveBtnGrad}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveBtnText}>
                      {diagnosisResult.isHealthy ? 'Cerrar' : 'Guardar diagnóstico'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Camera */}
      <CameraView
        ref={cameraRef as React.RefObject<CameraView>}
        style={styles.fill}
        facing={facing}
        flash={flashMode}
      >
        <SafeAreaView style={styles.cameraOverlay}>
          {/* Top bar */}
          <View style={styles.topControls}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <Feather name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Doctor de Plantas</Text>
            <TouchableOpacity onPress={toggleFlash} style={styles.iconBtn}>
              <Feather name={flashMode === 'off' ? 'zap-off' : 'zap'} size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity onPress={handleGalleryPick} style={styles.sideSlot}>
              <Feather name="image" size={24} color="#fff" />
            </TouchableOpacity>
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
  fill: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Camera overlay
  cameraOverlay: { flex: 1, justifyContent: 'space-between' },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  iconBtn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 24,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  sideSlot: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },

  // Modal
  modalSafe: { flex: 1, backgroundColor: '#fff' },
  modalScroll: { paddingBottom: 16 },
  modalPhoto: { width: '100%', height: 260 },
  modalLoading: { alignItems: 'center', gap: 12, padding: 40 },
  loadingText: { fontSize: 15, color: '#666' },
  modalBody: { padding: 20, gap: 16 },
  errorText: { fontSize: 14, color: '#DC2626', textAlign: 'center', lineHeight: 20 },

  // Healthy
  healthyIcon: { alignItems: 'center', paddingTop: 8 },
  healthyTitle: { fontSize: 22, fontWeight: '700', color: '#16A34A', textAlign: 'center' },
  healthySubtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },

  // Problem
  problemHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  problemName: { fontSize: 20, fontWeight: '700', color: '#1A2A1A', flex: 1 },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  severityText: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  typePill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typePillText: { fontSize: 12, color: '#555', fontWeight: '500' },
  confidenceText: { fontSize: 12, color: '#888' },
  infoBlock: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  treatmentBlock: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  productBlock: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  infoLabel: { fontSize: 11, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoText: { fontSize: 14, color: '#374151', lineHeight: 20 },

  // Buttons
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  retakeBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  retakeBtnText: { fontSize: 14, fontWeight: '600', color: '#555' },
  saveBtn: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveBtnGrad: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
