import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
import Header from "../../src/componets/common/Header";
import { useTheme } from "../../src/context/ThemeContext";
import { usePlantStorage } from "../../src/hooks/usePlantStorage";
import { type ApiUser } from "../../src/services/api";
import { Accelerometer } from "expo-sensors";
import * as Haptics from "expo-haptics";
import { getPendingPlants, markWateredToday } from "../../src/utils/careSchedule";
import { getLunarPhase, getDailyTip, type LunarDay } from "../../src/utils/lunarPhase";
import { LocalPlant } from "../../src/types-dtos/plant.types";
import { recordCare } from "../../src/services/careService";

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

// ── Estrellas para la card lunar ──────────────────────────────────────────────
const STARS = [
  { top: "18%", right: "22%", size: 2, opacity: 0.6 },
  { top: "35%", right: "40%", size: 1.5, opacity: 0.35 },
  { top: "65%", right: "15%", size: 2, opacity: 0.7 },
  { top: "22%", right: "60%", size: 1, opacity: 0.3 },
  { top: "75%", right: "50%", size: 1.5, opacity: 0.5 },
  { top: "48%", right: "8%", size: 1, opacity: 0.4 },
];

// ── Sección 1: Saludo ─────────────────────────────────────────────────────────
function GreetingCard({ user }: { user: ApiUser | null }) {
  const streak = user?.stats?.daysActive ?? 0;
  const initial = (user?.fullName ?? user?.username ?? "U")[0].toUpperCase();
  const today = new Date();

  return (
    <View style={styles.greetingCard}>
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
          <Text style={styles.greetingName} numberOfLines={1}>
            Hola, @{user?.username ?? "usuario"}
          </Text>
          <Text style={styles.greetingDate}>{formatDate(today)}</Text>
        </View>
        {/* Streak pill */}
        <View style={styles.streakPill}>
          <Feather name="zap" size={13} color="#E65100" />
          <Text style={styles.streakPillText}>{streak}</Text>
        </View>
      </View>
      {/* Tip motivacional si racha es 0 */}
      {streak === 0 && (
        <View style={styles.motivTip}>
          <Feather name="info" size={13} color="#2D7A4F" />
          <Text style={styles.motivText}>
            Registra un cuidado hoy para iniciar tu racha
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Sección 2: Luna ───────────────────────────────────────────────────────────
function LunarCard({ lunar }: { lunar: LunarDay }) {
  return (
    <View style={styles.lunarCard}>
      {STARS.map((s, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            top: s.top as any,
            right: s.right as any,
            width: s.size,
            height: s.size,
            borderRadius: s.size / 2,
            backgroundColor: "#fff",
            opacity: s.opacity,
          }}
        />
      ))}
      <View style={styles.lunarBadge}>
        <Text style={styles.lunarBadgeText}>Hoy</Text>
      </View>
      <Feather name="moon" size={32} color="#C0B0EE" />
      <View style={{ flex: 1 }}>
        <Text style={styles.lunarName}>{lunar.name}</Text>
        <Text style={styles.lunarRec}>{lunar.recommendation}</Text>
      </View>
    </View>
  );
}

// ── Sección 3: Tip del día ────────────────────────────────────────────────────
function DailyTipCard({ tip }: { tip: string }) {
  return (
    <LinearGradient
      colors={["#E8F5EE", "#D4F0E0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.tipCard}
    >
      <Feather name="feather" size={20} color="#2D7A4F" style={{ marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.tipLabel}>TIP DEL DÍA</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>
    </LinearGradient>
  );
}

// ── Sección 4: Cuidados ───────────────────────────────────────────────────────
function CareSection({
  pendingPlants,
  onMarkDone,
}: {
  pendingPlants: LocalPlant[];
  onMarkDone: (id: string) => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cuidados pendientes</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/explore" as any)}>
          <Text style={styles.sectionLink}>Ver todos →</Text>
        </TouchableOpacity>
      </View>

      {pendingPlants.length === 0 ? (
        <View style={styles.allDoneBox}>
          <View style={styles.allDoneIcon}>
            <Feather name="check" size={22} color="#2D7A4F" />
          </View>
          <Text style={styles.allDoneText}>
            ¡Todo al día! Sin cuidados pendientes.
          </Text>
        </View>
      ) : (
        pendingPlants.map((plant) => (
          <View key={plant.localId} style={styles.careRow}>
            {plant.localPhotoUri ? (
              <Image
                source={{ uri: plant.localPhotoUri }}
                style={styles.carePhoto}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.carePhoto, styles.carePlaceholder]}>
                <Feather name="image" size={16} color="#8A9A8A" />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.careName} numberOfLines={1}>
                {plant.commonName}
              </Text>
              <View style={styles.careTypePill}>
                <Feather name="droplet" size={10} color="#1565C0" />
                <Text style={styles.careTypePillText}>Riego</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => onMarkDone(plant.localId)}
              style={styles.doneBtn}
            >
              <Feather name="check" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}

// ── Sección 5: Grid de plantas ────────────────────────────────────────────────
function PlantGrid({
  plants,
  pendingIds,
}: {
  plants: LocalPlant[];
  pendingIds: string[];
}) {
  const { width } = useWindowDimensions();
  const cardW = (width - 16 * 2 - 8) / 2;

  const rows: LocalPlant[][] = [];
  for (let i = 0; i < Math.max(plants.length, 1); i += 2) {
    rows.push(plants.slice(i, i + 2));
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mis plantas</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/explore" as any)}>
          <Text style={styles.sectionLink}>Ver colección →</Text>
        </TouchableOpacity>
      </View>

      {plants.length === 0 ? (
        <View style={styles.gridRow}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/add" as any)}
            style={[styles.emptyPlantCard, { width: cardW }]}
          >
            <Feather name="plus" size={24} color="#2D7A4F" />
            <Text style={styles.emptyPlantText}>
              Agrega tu primera planta
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        rows.map((row, ri) => (
          <View key={ri} style={styles.gridRow}>
            {row.map((plant) => {
              const isPending = pendingIds.includes(plant.localId);
              return (
                <TouchableOpacity
                  key={plant.localId}
                  onPress={() =>
                    router.push(`/plant-detail?localId=${plant.localId}` as any)
                  }
                  style={[styles.plantCard, { width: cardW }]}
                  activeOpacity={0.8}
                >
                  {plant.localPhotoUri ? (
                    <Image
                      source={{ uri: plant.localPhotoUri }}
                      style={styles.plantPhoto}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.plantPhoto, styles.plantPhotoPlaceholder]}>
                      <Feather name="feather" size={24} color="#2D7A4F" />
                    </View>
                  )}
                  <View style={{ padding: 10 }}>
                    <Text style={styles.plantName} numberOfLines={1}>
                      {plant.commonName}
                    </Text>
                    <View style={styles.careDot}>
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: isPending ? "#F44336" : "#4CAF50" },
                        ]}
                      />
                      <Text
                        style={[
                          styles.careLabel,
                          { color: isPending ? "#F44336" : "#4CAF50" },
                        ]}
                      >
                        {isPending ? "Riego: hoy" : "Próximamente"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))
      )}
    </View>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
const SHAKE_THRESHOLD = 1.8;
const COOLDOWN_MS = 2000;

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { plants, refresh } = usePlantStorage(user?.id ?? "user-1");
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [showShakeModal, setShowShakeModal] = useState(false);
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);
  const cooldownRef = useRef(false);
  const lunar = getLunarPhase();
  const dailyTip = getDailyTip();

  const loadPending = useCallback(async () => {
    const ids = await getPendingPlants(
      plants.map((p) => ({ localId: p.localId, watering: p.watering }))
    );
    setPendingIds(ids);
  }, [plants]);

  useFocusEffect(
    useCallback(() => {
      refresh();
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

  useEffect(() => {
    if (plants.length > 0) loadPending();
  }, [plants, loadPending]);

  const handleMarkDone = async (localId: string) => {
    await markWateredToday(localId);
    setPendingIds((prev) => prev.filter((id) => id !== localId));
  };

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
    setShowShakeModal(false);
    setSelectedPlantIds([]);
    await refresh();
    const ids = await getPendingPlants(
      plants.map((p) => ({ localId: p.localId, watering: p.watering }))
    );
    setPendingIds(ids);
  };

  const pendingPlants = plants.filter((p) => pendingIds.includes(p.localId));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <GreetingCard user={user} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <LunarCard lunar={lunar} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <DailyTipCard tip={dailyTip} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(400)}>
          <CareSection
            pendingPlants={pendingPlants}
            onMarkDone={handleMarkDone}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(400)}>
          <PlantGrid plants={plants} pendingIds={pendingIds} />
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

  // Lunar
  lunarCard: {
    backgroundColor: "#1A1040",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3D2D80",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    overflow: "hidden",
    minHeight: 80,
  },
  lunarBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  lunarBadgeText: { color: "#C0B0EE", fontSize: 11, fontWeight: "600" },
  lunarName: { color: "#E0D4FF", fontSize: 16, fontWeight: "700" },
  lunarRec: { color: "#A090CC", fontSize: 13, marginTop: 3, lineHeight: 18 },

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
  gridRow: { flexDirection: "row", gap: 8 },
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
  plantPhoto: { width: "100%", height: 80 },
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
