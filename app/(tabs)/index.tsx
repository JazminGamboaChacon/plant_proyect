import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "../../src/context/AuthContext";
import { useToast } from "../../src/context/ToastContext";
import Header from "../../src/componets/common/Header";
import { useTheme } from "../../src/context/ThemeContext";
import { usePlantStorage } from "../../src/hooks/usePlantStorage";
import { type ApiUser } from "../../src/services/api";
import { Accelerometer } from "expo-sensors";
import * as Haptics from "expo-haptics";
import { getDailyTip } from "../../src/utils/lunarPhase";
import { LocalPlant } from "../../src/types-dtos/plant.types";
import { recordCare, getPendingCareTypes } from "../../src/services/careService";
import { checkAndUnlock } from "../../src/services/achievementService";
import { updateAppStreak } from "../../src/services/streakService";

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-CR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ── Hoja SVG decorativa ───────────────────────────────────────────────────────
function DecorLeaf() {
  return (
    <Svg
      width={80}
      height={80}
      viewBox="0 0 100 100"
      style={{ position: "absolute", bottom: 0, right: 0, opacity: 0.07 }}
    >
      <Path d="M 10 90 Q 10 10 90 10 Q 50 50 10 90 Z" fill="#2D7A4F" />
      <Path
        d="M 10 90 Q 50 50 90 10"
        stroke="#2D7A4F"
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

// ── Sección 1: Saludo ─────────────────────────────────────────────────────────
function GreetingCard({ user, streak }: { user: ApiUser | null; streak: number }) {
  const { theme } = useTheme();
  const t = theme.colors;
  const initial = (user?.fullName ?? user?.username ?? "U")[0].toUpperCase();
  const today = new Date();

  return (
    <View style={[styles.greetingCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      <DecorLeaf />
      <View style={styles.greetingTop}>
        {/* Avatar */}
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <LinearGradient
            colors={["#2D7A4F", "#4CAF50"]}
            style={styles.avatar}
          >
            <Text style={styles.avatarInitial}>{initial}</Text>
          </LinearGradient>
        )}
        {/* Nombre + fecha */}
        <View style={{ flex: 1 }}>
          <Text style={[styles.greetingName, { color: t.textPrimary }]} numberOfLines={1}>
            Hola, @{user?.username ?? "usuario"}
          </Text>
          <Text style={[styles.greetingDate, { color: t.textSecondary }]}>{formatDate(today)}</Text>
        </View>
        {/* Streak pill */}
        <View style={styles.streakPill}>
          <Feather name="zap" size={13} color="#E65100" />
          <Text style={styles.streakPillText}>{streak}</Text>
        </View>
      </View>
      {/* Tip motivacional */}
      {streak === 0 && (
        <View style={[styles.motivTip, { backgroundColor: t.primarySoft }]}>
          <Feather name="info" size={13} color={t.primary} />
          <Text style={[styles.motivText, { color: t.primary }]}>
            Abre la app cada día para mantener tu racha
          </Text>
        </View>
      )}
      {streak === 1 && (
        <View style={[styles.motivTip, { backgroundColor: t.primarySoft }]}>
          <Feather name="zap" size={13} color="#E65100" />
          <Text style={[styles.motivText, { color: t.primary }]}>
            Llevas 1 día seguido, vuelve mañana para sumar
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Sección 3: Tip del día ────────────────────────────────────────────────────
function DailyTipCard({ tip }: { tip: string }) {
  const { theme } = useTheme();
  const t = theme.colors;
  return (
    <LinearGradient
      colors={[t.primarySoft, t.primaryPale]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.tipCard, { borderColor: t.primaryLight }]}
    >
      <Feather name="feather" size={20} color={t.primary} style={{ marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.tipLabel, { color: t.primary }]}>TIP DEL DÍA</Text>
        <Text style={[styles.tipText, { color: t.textPrimary }]}>{tip}</Text>
      </View>
    </LinearGradient>
  );
}

// ── Sección 4: Cuidados ───────────────────────────────────────────────────────
function CareSection({ pendingPlants }: { pendingPlants: LocalPlant[] }) {
  const { theme } = useTheme();
  const t = theme.colors;
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.textPrimary }]}>Cuidados pendientes</Text>
      </View>

      {pendingPlants.length === 0 ? (
        <View style={[styles.allDoneBox, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={[styles.allDoneIcon, { backgroundColor: t.primarySoft }]}>
            <Feather name="check" size={22} color={t.primary} />
          </View>
          <Text style={[styles.allDoneText, { color: t.textSecondary }]}>
            ¡Todo al día! Sin cuidados pendientes.
          </Text>
        </View>
      ) : (
        pendingPlants.map((plant) => (
          <View key={plant.localId} style={[styles.careRow, { backgroundColor: t.surface, borderColor: t.border }]}>
            {plant.localPhotoUri ? (
              <Image
                source={{ uri: plant.localPhotoUri }}
                style={styles.carePhoto}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.carePhoto, styles.carePlaceholder, { backgroundColor: t.primarySoft }]}>
                <Feather name="image" size={16} color={t.textSecondary} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.careName, { color: t.textPrimary }]} numberOfLines={1}>
                {plant.commonName}
              </Text>
              <View style={styles.careTypePill}>
                <Feather name="droplet" size={10} color="#1565C0" />
                <Text style={styles.careTypePillText}>Riego</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

// ── Sección 5: Grid de plantas ────────────────────────────────────────────────
function PlantGrid({ plants }: { plants: LocalPlant[] }) {
  const { theme } = useTheme();
  const t = theme.colors;
  const { width } = useWindowDimensions();
  const cardW = Math.round(width * 0.42);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.textPrimary }]}>Mis plantas</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/explore" as any)}>
          <Text style={[styles.sectionLink, { color: t.primary }]}>Ver colección →</Text>
        </TouchableOpacity>
      </View>

      {plants.length === 0 ? (
        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/add" as any)}
            style={[styles.emptyPlantCard, { backgroundColor: t.primarySoft, borderColor: t.primaryLight, width: cardW }]}
          >
            <Feather name="plus" size={24} color={t.primary} />
            <Text style={[styles.emptyPlantText, { color: t.primary }]}>Agrega tu primera planta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(p) => p.localId}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plantRow}
          renderItem={({ item: plant }) => (
            <TouchableOpacity
              onPress={() => router.push(`/plant-detail?localId=${plant.localId}` as any)}
              style={[styles.plantCard, { backgroundColor: t.surface, borderColor: t.border, width: cardW }]}
              activeOpacity={0.8}
            >
              {plant.localPhotoUri ? (
                <Image
                  source={{ uri: plant.localPhotoUri }}
                  style={styles.plantPhoto}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.plantPhoto, styles.plantPhotoPlaceholder, { backgroundColor: t.primarySoft }]}>
                  <Feather name="feather" size={24} color={t.primary} />
                </View>
              )}
              <View style={{ padding: 10 }}>
                <Text style={[styles.plantName, { color: t.textPrimary }]} numberOfLines={1}>
                  {plant.commonName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// ── Sección 6: Doctor de Plantas ─────────────────────────────────────────────
function DoctorCard() {
  const { theme, isDark } = useTheme();
  const t = theme.colors;
  const gradientColors = isDark
    ? (["#2A1508", "#1A0D04"] as const)
    : (["#FFF3E0", "#FFE8CC"] as const);
  const iconBg = isDark ? "#2A1508" : "#FFF8E1";
  const borderColor = isDark ? "#5C2A10" : "#FFB74D";
  return (
    <TouchableOpacity onPress={() => router.push("/doctor" as any)} activeOpacity={0.82}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.doctorCard, { borderColor }]}
      >
        <View style={[styles.doctorIconBox, { backgroundColor: iconBg }]}>
          <MaterialCommunityIcons name="stethoscope" size={28} color="#E65100" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.doctorTitle, { color: t.textPrimary }]}>Doctor de Plantas</Text>
          <Text style={[styles.doctorSubtitle, { color: t.textSecondary }]}>Diagnostica enfermedades y plagas</Text>
        </View>
        <Feather name="chevron-right" size={20} color={t.textSecondary} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
const SHAKE_THRESHOLD = 1.8;
const COOLDOWN_MS = 2000;

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { plants, refresh } = usePlantStorage(user?.id ?? "user-1");
  const [showShakeModal, setShowShakeModal] = useState(false);
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const cooldownRef = useRef(false);
  const dailyTip = getDailyTip();

  useFocusEffect(
    useCallback(() => {
      refresh();
      updateAppStreak(user?.id ?? "user-1").then(setStreak);
      Accelerometer.setUpdateInterval(100);
      const sub = Accelerometer.addListener(({ x, y, z }) => {
        const total = Math.sqrt(x * x + y * y + z * z);
        if (total > SHAKE_THRESHOLD && !cooldownRef.current) {
          cooldownRef.current = true;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setShowShakeModal(true);
          setTimeout(() => { cooldownRef.current = false; }, COOLDOWN_MS);
        }
      });
      return () => sub.remove();
    }, [refresh])
  );

  const toggleSelection = (localId: string) => {
    setSelectedPlantIds((prev) =>
      prev.includes(localId) ? prev.filter((id) => id !== localId) : [...prev, localId]
    );
  };

  const handleShakeConfirm = async () => {
    const userId = user?.id ?? "user-1";
    for (const localId of selectedPlantIds) {
      const plant = plants.find((p) => p.localId === localId);
      if (plant) await recordCare(plant, "riego", "shake", userId);
    }
    const unlocked = await checkAndUnlock(userId).catch(() => []);
    for (const label of unlocked) showToast(label, 'success');
    setShowShakeModal(false);
    setSelectedPlantIds([]);
    await refresh();
  };

  const pendingPlants = plants.filter((p) => getPendingCareTypes(p).includes("riego"));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <GreetingCard user={user} streak={streak} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <DailyTipCard tip={dailyTip} />
        </Animated.View>

        {pendingPlants.length > 0 && (
          <Animated.View entering={FadeInDown.delay(240).duration(400)}>
            <CareSection
              pendingPlants={pendingPlants}
            />
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(320).duration(400)}>
          <PlantGrid plants={plants} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <DoctorCard />
        </Animated.View>
      </ScrollView>

      {/* Módulo 7 — Modal de sacudida */}
      <Modal
        visible={showShakeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShakeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              ¿Qué planta regaste?
            </Text>
            {pendingPlants.length === 0 ? (
              <Text style={[styles.modalEmpty, { color: theme.colors.textSecondary }]}>
                No hay plantas con riego pendiente
              </Text>
            ) : (
              <FlatList
                data={pendingPlants}
                keyExtractor={(item) => item.localId}
                style={{ maxHeight: 300 }}
                renderItem={({ item }) => {
                  const selected = selectedPlantIds.includes(item.localId);
                  return (
                    <TouchableOpacity
                      onPress={() => toggleSelection(item.localId)}
                      style={[
                        styles.modalPlantRow,
                        { borderColor: theme.colors.border },
                        selected && { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryPale },
                      ]}
                    >
                      <Image source={{ uri: item.localPhotoUri }} style={styles.modalPhoto} />
                      <Text
                        style={[styles.modalPlantName, { color: theme.colors.textPrimary }]}
                        numberOfLines={1}
                      >
                        {item.commonName}
                      </Text>
                      {selected && (
                        <Feather name="check" size={18} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <View style={styles.modalBtns}>
              <TouchableOpacity
                onPress={() => { setShowShakeModal(false); setSelectedPlantIds([]); }}
                style={[styles.modalCancelBtn, { borderColor: theme.colors.border }]}
              >
                <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShakeConfirm}
                style={[styles.modalConfirmBtn, { backgroundColor: theme.colors.primary }]}
                disabled={selectedPlantIds.length === 0}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, gap: 12, paddingBottom: 32 },

  // Greeting
  greetingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0ECE0",
    padding: 16,
    gap: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#2D7A4F",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  greetingTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { color: "#fff", fontSize: 16, fontWeight: "700" },
  greetingName: { fontSize: 15, fontWeight: "700", color: "#1A2A1A" },
  greetingDate: { fontSize: 12, color: "#8A9A8A", textTransform: "capitalize", marginTop: 1 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF3E0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  streakPillText: { color: "#E65100", fontWeight: "700", fontSize: 13 },
  motivTip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0FAF3",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  motivText: { color: "#2D7A4F", fontSize: 12, lineHeight: 17, flex: 1 },

  // Tip del día
  tipCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#A0D8B0",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2D7A4F",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  tipText: { fontSize: 13, color: "#2A4A2A", lineHeight: 19 },

  // Section headers
  section: { gap: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1A2A1A" },
  sectionLink: { color: "#2D7A4F", fontSize: 12, fontWeight: "500" },

  // Care
  allDoneBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0ECE0",
    padding: 16,
  },
  allDoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F5EE",
    justifyContent: "center",
    alignItems: "center",
  },
  allDoneText: { fontSize: 14, color: "#4A5A4E", flex: 1 },
  careRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0ECE0",
    padding: 10,
    elevation: 1,
    shadowColor: "#2D7A4F",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  carePhoto: { width: 52, height: 52, borderRadius: 10 },
  carePlaceholder: {
    backgroundColor: "#F0F4F0",
    justifyContent: "center",
    alignItems: "center",
  },
  careName: { fontSize: 14, fontWeight: "600", color: "#1A2A1A", marginBottom: 4 },
  careTypePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  careTypePillText: { fontSize: 11, color: "#1565C0", fontWeight: "500" },
  doneBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },

  // Plant grid
  plantRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  plantCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0ECE0",
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#2D7A4F",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  plantPhoto: { width: "100%", height: 100 },
  plantPhotoPlaceholder: {
    backgroundColor: "#E8F5EE",
    justifyContent: "center",
    alignItems: "center",
  },
  plantName: { fontSize: 13, fontWeight: "700", color: "#1A2A1A", marginBottom: 2 },
  careDot: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  careLabel: { fontSize: 11 },
  emptyPlantCard: {
    backgroundColor: "#F0FAF3",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#A0D8B0",
    borderStyle: "dashed",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    padding: 12,
  },
  emptyPlantText: {
    color: "#2D7A4F",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },

  // Doctor card
  doctorCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFB74D",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    elevation: 2,
    shadowColor: "#E65100",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  doctorIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF8E1",
    justifyContent: "center",
    alignItems: "center",
  },
  doctorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A2A1A",
  },
  doctorSubtitle: {
    fontSize: 12,
    color: "#8A9A8A",
    marginTop: 3,
  },

  // Shake modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    gap: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  modalEmpty: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
  modalPlantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  modalPhoto: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#E8F5EE",
  },
  modalPlantName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  modalBtns: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalConfirmText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
