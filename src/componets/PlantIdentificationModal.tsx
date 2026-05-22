import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { PlantIdentificationResult } from '../services/plantIdService';
import { summarizeSunlight, summarizeSoil, summarizeWatering } from '../utils/plantTranslations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PHOTO_HEIGHT = SCREEN_HEIGHT * 0.4;
const VIEWFINDER_SIZE = 200;
const CORNER_LEN = 20;
const CORNER_THICK = 3;

// ─── Loading: Scan animation ───────────────────────────────────────────────

function ScanOverlay({ photoHeight }: { photoHeight: number }) {
  const scanY = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0.2)).current;
  const breatheScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, {
          toValue: photoHeight - 2,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    const progressLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(progressWidth, {
          toValue: 0.85,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(progressWidth, {
          toValue: 0.2,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheScale, {
          toValue: 1.06,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    scanLoop.start();
    progressLoop.start();
    breatheLoop.start();
    return () => {
      scanLoop.stop();
      progressLoop.stop();
      breatheLoop.stop();
    };
  }, []);

  const cornerColor = '#4CFF80';

  return (
    <>
      {/* Overlay verde sobre foto */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: photoHeight,
          backgroundColor: 'rgba(45,122,79,0.15)',
        }}
      />

      {/* Marco viewfinder — 4 esquinas */}
      <View
        style={{
          position: 'absolute',
          top: (photoHeight - VIEWFINDER_SIZE) / 2,
          left: (SCREEN_WIDTH - VIEWFINDER_SIZE) / 2,
          width: VIEWFINDER_SIZE,
          height: VIEWFINDER_SIZE,
        }}
      >
        {/* Esquina sup-izq */}
        <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK, borderColor: cornerColor }]} />
        {/* Esquina sup-der */}
        <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: CORNER_THICK, borderRightWidth: CORNER_THICK, borderColor: cornerColor }]} />
        {/* Esquina inf-izq */}
        <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK, borderColor: cornerColor }]} />
        {/* Esquina inf-der */}
        <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: CORNER_THICK, borderRightWidth: CORNER_THICK, borderColor: cornerColor }]} />

        {/* Línea de escaneo dentro del viewfinder */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1.5,
            transform: [{ translateY: scanY }],
          }}
        >
          <LinearGradient
            colors={['transparent', '#4CFF80', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>

      {/* Texto sobre foto */}
      <View
        style={{
          position: 'absolute',
          bottom: photoHeight - 24,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Analizando imagen...</Text>
      </View>

      {/* Sección inferior */}
      <View style={styles.loadingBottom}>
        <Animated.View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#E8F5EE',
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scale: breatheScale }],
          }}
        >
          <Ionicons name="leaf" size={28} color="#2D7A4F" />
        </Animated.View>

        <Text style={styles.loadingTitle}>Identificando planta...</Text>
        <Text style={styles.loadingSubtitle}>Analizando hojas, forma y color</Text>

        {/* Barra de progreso */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        {/* Chips de pasos */}
        <View style={styles.stepsRow}>
          <View style={[styles.stepChip, { opacity: 0.4 }]}>
            <Text style={styles.stepText}>✓ Captura</Text>
          </View>
          <View style={[styles.stepChip, styles.stepActive]}>
            <Text style={[styles.stepText, { color: '#2D7A4F' }]}>🔍 Análisis</Text>
          </View>
          <View style={[styles.stepChip, { backgroundColor: '#EAEAEA' }]}>
            <Text style={[styles.stepText, { color: '#AAA' }]}>📋 Resultado</Text>
          </View>
        </View>
      </View>
    </>
  );
}

// ─── Badges ────────────────────────────────────────────────────────────────

function ConfidenceBadge({ value }: { value: number }) {
  let bg: string, color: string, label: string;
  if (value < 30) {
    bg = '#FFF0E0'; color = '#C06010'; label = '⚠ Baja confianza';
  } else if (value < 70) {
    bg = '#FFF8E0'; color = '#C08010'; label = '~ Confianza media';
  } else {
    bg = '#E8F5EE'; color = '#2D7A4F'; label = '✓ Alta confianza';
  }
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
      <View style={{ width: 40, height: 3, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, marginTop: 3 }}>
        <View style={{ width: `${Math.min(value, 100)}%`, height: 3, backgroundColor: color, borderRadius: 2 }} />
      </View>
    </View>
  );
}

function ToxicityBadge({ value }: { value: string }) {
  if (!value || value === 'No disponible') return null;
  const lower = value.toLowerCase();
  const isToxic =
    !lower.includes('non-toxic') &&
    !lower.includes('no tóxic') &&
    !lower.includes('not toxic') &&
    (lower.includes('toxic') || lower.includes('tóxic') || lower.includes('poison'));
  return (
    <View style={[styles.badge, { backgroundColor: isToxic ? '#FFF0F0' : '#E8F5EE' }]}>
      <Text style={[styles.badgeText, { color: isToxic ? '#C62828' : '#2D7A4F' }]}>
        {isToxic ? '☠ Tóxica' : '✓ No tóxica'}
      </Text>
    </View>
  );
}

// ─── Care Card ─────────────────────────────────────────────────────────────

function CareCard({
  icon,
  label,
  summary,
  fullText,
  iconColor,
  onPress,
}: {
  icon: string;
  label: string;
  summary: string;
  fullText: string;
  iconColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.careCard} onPress={onPress} activeOpacity={0.75}>
      <Feather name={icon as any} size={18} color={iconColor} />
      <Text style={styles.careLabel}>{label}</Text>
      <Text style={styles.careValue}>{summary}</Text>
    </TouchableOpacity>
  );
}

// ─── Care Detail Modal ─────────────────────────────────────────────────────

function CareDetailModal({
  detail,
  onClose,
}: {
  detail: { label: string; fullText: string } | null;
  onClose: () => void;
}) {
  return (
    <Modal visible={!!detail} transparent animationType="fade">
      <View style={styles.detailOverlay}>
        <View style={styles.detailSheet}>
          <Text style={styles.detailLabel}>{detail?.label}</Text>
          <Text style={styles.detailText}>{detail?.fullText}</Text>
          <TouchableOpacity style={styles.detailCloseBtn} onPress={onClose}>
            <Text style={styles.detailCloseTxt}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────

interface PlantIdentificationModalProps {
  visible: boolean;
  photoUri: string | null;
  photoBase64?: string;
  result: PlantIdentificationResult | null;
  isLoading: boolean;
  error: string | null;
  onSave: (result: PlantIdentificationResult) => void;
  onRetake: () => void;
}

export default function PlantIdentificationModal({
  visible,
  photoUri,
  photoBase64,
  result,
  isLoading,
  error,
  onSave,
  onRetake,
}: PlantIdentificationModalProps) {
  const { theme } = useTheme();
  const [careDetail, setCareDetail] = useState<{ label: string; fullText: string } | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);

  const photoSource = photoBase64
    ? { uri: `data:image/jpeg;base64,${photoBase64}` }
    : photoUri
    ? { uri: photoUri }
    : null;

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F0E8' }}>

        {/* Foto siempre visible */}
        {photoSource ? (
          <Image source={photoSource} style={styles.photo} resizeMode="cover" />
        ) : (
          <View style={[styles.photo, { backgroundColor: '#ddd' }]} />
        )}

        {/* Estado: cargando */}
        {isLoading && <ScanOverlay photoHeight={PHOTO_HEIGHT} />}

        {/* Estado: error */}
        {!isLoading && error && (
          <View style={styles.centerPanel}>
            <Feather name="alert-circle" size={48} color={theme.colors.error} />
            <Text style={[styles.centerText, { color: theme.colors.error }]}>{error}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onRetake}>
              <Text style={styles.primaryBtnTxt}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Estado: no es planta */}
        {!isLoading && !error && result && !result.isPlant && (
          <View style={styles.centerPanel}>
            <Feather name="x-circle" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.centerText, { color: theme.colors.textPrimary }]}>
              No se detectó una planta en la imagen.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onRetake}>
              <Text style={styles.primaryBtnTxt}>Tomar otra foto</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Estado: resultado */}
        {!isLoading && !error && result && result.isPlant && (
          <>
            <CareDetailModal detail={careDetail} onClose={() => setCareDetail(null)} />

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.resultContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Nombres */}
              <Text style={styles.commonName}>{result.commonName}</Text>
              <Text style={styles.scientificName}>
                {result.scientificName}
                {result.family !== 'No disponible' ? ` • Familia: ${result.family}` : ''}
              </Text>

              {/* Badges */}
              <View style={styles.badgeRow}>
                <ConfidenceBadge value={result.confidence} />
                <ToxicityBadge value={result.toxicity} />
              </View>

              {/* Banner baja confianza */}
              {result.confidence < 40 && (
                <View style={styles.lowConfBanner}>
                  <Text style={styles.lowConfText}>
                    ⚠ La identificación tiene baja certeza. ¿Es correcta esta planta?
                  </Text>
                  <TouchableOpacity onPress={onRetake}>
                    <Text style={styles.lowConfLink}>Buscar otra vez →</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Tarjetas de cuidado */}
              <View style={styles.careRow}>
                <CareCard
                  icon="droplet"
                  label="Riego"
                  summary={summarizeWatering(result.watering)}
                  fullText={result.watering}
                  iconColor="#3B9BDB"
                  onPress={() => setCareDetail({ label: 'Riego', fullText: result.watering })}
                />
                <CareCard
                  icon="sun"
                  label="Luz"
                  summary={summarizeSunlight(result.sunlight)}
                  fullText={result.sunlight}
                  iconColor="#E0A020"
                  onPress={() => setCareDetail({ label: 'Luz', fullText: result.sunlight })}
                />
                <CareCard
                  icon="layers"
                  label="Sustrato"
                  summary={summarizeSoil(result.soil)}
                  fullText={result.soil}
                  iconColor="#7A5C3A"
                  onPress={() => setCareDetail({ label: 'Sustrato', fullText: result.soil })}
                />
              </View>

              {/* Descripción */}
              {result.description !== 'No disponible' && (
                <View style={styles.descBox}>
                  <Text style={styles.descLabel}>DESCRIPCIÓN</Text>
                  <Text
                    style={styles.descText}
                    numberOfLines={descExpanded ? undefined : 3}
                  >
                    {result.description}
                  </Text>
                  <TouchableOpacity onPress={() => setDescExpanded((v) => !v)}>
                    <Text style={styles.descToggle}>
                      {descExpanded ? 'Ver menos' : 'Ver más'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Botones */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.secondaryBtn} onPress={onRetake}>
                  <Text style={styles.secondaryBtnTxt}>Retomar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryBtnWrap}
                  onPress={() => onSave(result)}
                  activeOpacity={0.82}
                >
                  <LinearGradient
                    colors={['#2D7A4F', '#4CAF50']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtnGrad}
                  >
                    <Feather name="plus" size={16} color="#fff" />
                    <Text style={styles.primaryBtnTxt}>Agregar a colección</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        )}

      </SafeAreaView>
    </Modal>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: PHOTO_HEIGHT,
  },

  // Loading
  loadingBottom: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A3A2A',
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#4A6A50',
    marginTop: -4,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E8EDE8',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#2D7A4F',
    borderRadius: 2,
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  stepChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#E8EDE8',
  },
  stepActive: {
    backgroundColor: '#E8F5EE',
  },
  stepText: {
    fontSize: 11,
    color: '#4A6A50',
    fontWeight: '500',
  },

  // Viewfinder corners
  corner: {
    position: 'absolute',
    width: CORNER_LEN,
    height: CORNER_LEN,
    borderColor: '#4CFF80',
  },

  // Center states (error, no plant)
  centerPanel: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  centerText: {
    fontSize: 15,
    textAlign: 'center',
  },

  // Result
  resultContent: {
    padding: 20,
    gap: 12,
    paddingBottom: 32,
    backgroundColor: '#F5F0E8',
  },
  commonName: {
    fontFamily: 'Lora_400Regular_Italic',
    fontSize: 26,
    fontWeight: '600',
    color: '#1A2A1A',
  },
  scientificName: {
    fontStyle: 'italic',
    fontSize: 13,
    color: '#6A8A6A',
    marginTop: -4,
  },

  // Badges
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Low confidence banner
  lowConfBanner: {
    backgroundColor: '#FFF8E8',
    borderWidth: 1,
    borderColor: '#F0B840',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  lowConfText: {
    fontSize: 13,
    color: '#7A5010',
  },
  lowConfLink: {
    fontSize: 13,
    color: '#C08010',
    fontWeight: '600',
  },

  // Care cards
  careRow: {
    flexDirection: 'row',
    gap: 8,
  },
  careCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0ECE0',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#2D7A4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  careLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#4A8A6A',
    letterSpacing: 0.5,
  },
  careValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A2A1A',
    textAlign: 'center',
  },

  // Care detail modal
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  detailSheet: {
    backgroundColor: '#FAF7F2',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D7A4F',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 14,
    color: '#4A5A4E',
    lineHeight: 22,
  },
  detailCloseBtn: {
    backgroundColor: '#E8F5EE',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  detailCloseTxt: {
    color: '#2D7A4F',
    fontWeight: '600',
    fontSize: 14,
  },

  // Description
  descBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0ECE0',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  descLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#2D7A4F',
    letterSpacing: 0.8,
  },
  descText: {
    fontSize: 13.5,
    color: '#4A5A4A',
    lineHeight: 22,
  },
  descToggle: {
    fontSize: 13,
    color: '#2D7A4F',
    fontWeight: '600',
    marginTop: 2,
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C0D0C0',
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryBtnTxt: {
    color: '#4A6A4A',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#2D7A4F',
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnWrap: {
    flex: 1.8,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2D7A4F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  primaryBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  primaryBtnTxt: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
