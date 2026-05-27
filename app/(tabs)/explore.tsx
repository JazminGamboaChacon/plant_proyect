import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/context/ThemeContext";
import { useAuth } from "../../src/context/AuthContext";
import { usePlantStorage } from "../../src/hooks/usePlantStorage";
import { LocalPlant } from "../../src/types-dtos/plant.types";
import { LocalDiagnosis } from "../../src/types-dtos/disease.types";
import { getDiagnoses, removeDiagnosis } from "../../src/services/diseaseService";
import Header from "../../src/componets/common/Header";
import MonsteraLoader from "../../src/componets/common/MonsteraLoader";

type ActiveTab = "plants" | "diseases";

const SEVERITY_COLOR: Record<string, string> = {
  leve: "#F59E0B",
  moderado: "#EA580C",
  grave: "#DC2626",
};

const TYPE_LABEL: Record<string, string> = {
  enfermedad: "Enfermedad",
  plaga: "Plaga",
  deficiencia: "Deficiencia",
  otro: "Otro",
};

// ── Plants tab ────────────────────────────────────────────────────────────────

function ToxicityBadge({ value }: { value: string }) {
  if (!value || value === "No disponible") return null;
  const lower = value.toLowerCase();
  const isToxic =
    !lower.includes("non-toxic") &&
    !lower.includes("no tóxic") &&
    !lower.includes("not toxic") &&
    (lower.includes("toxic") || lower.includes("tóxic") || lower.includes("poison"));
  return (
    <View style={[styles.toxicBadge, { backgroundColor: isToxic ? "#C62828" : "#2E7D32" }]}>
      <Text style={styles.toxicBadgeText}>{isToxic ? "Tóxica" : "No tóxica"}</Text>
    </View>
  );
}

function PlantCard({ plant }: { plant: LocalPlant }) {
  const { theme } = useTheme();
  const t = theme.colors;
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}
      onPress={() => router.push(`/plant-detail?localId=${plant.localId}`)}
      activeOpacity={0.75}
    >
      {plant.localPhotoUri ? (
        <Image source={{ uri: plant.localPhotoUri }} style={styles.cardPhoto} resizeMode="cover" />
      ) : (
        <View style={[styles.cardPhoto, styles.cardPhotoPlaceholder, { backgroundColor: t.border }]}>
          <Feather name="image" size={28} color={t.textSecondary} />
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={[styles.cardName, { color: t.textPrimary }]} numberOfLines={1}>
          {plant.commonName}
        </Text>
        <Text style={[styles.cardScientific, { color: t.textSecondary }]} numberOfLines={1}>
          {plant.scientificName}
        </Text>
        <View style={styles.cardMeta}>
          {plant.watering ? (
            <View style={styles.metaItem}>
              <Feather name="droplet" size={12} color={t.textSecondary} />
              <Text style={[styles.metaText, { color: t.textSecondary }]} numberOfLines={1}>
                {plant.watering}
              </Text>
            </View>
          ) : null}
          <ToxicityBadge value={plant.toxicity} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Diseases tab ──────────────────────────────────────────────────────────────

function DiagnosisDetailModal({
  diagnosis,
  onClose,
}: {
  diagnosis: LocalDiagnosis | null;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const t = theme.colors;
  if (!diagnosis) return null;
  const date = new Date(diagnosis.createdAt).toLocaleDateString("es-CR", {
    day: "numeric", month: "short", year: "numeric",
  });
  return (
    <Modal visible={!!diagnosis} animationType="slide" transparent={false}>
      <SafeAreaView style={[detailStyles.safe, { backgroundColor: t.surface }]}>
        <ScrollView contentContainerStyle={detailStyles.scroll} showsVerticalScrollIndicator={false}>
          {diagnosis.photoUri ? (
            <Image source={{ uri: diagnosis.photoUri }} style={detailStyles.photo} resizeMode="cover" />
          ) : null}

          {diagnosis.isHealthy ? (
            <View style={detailStyles.body}>
              <View style={detailStyles.centerIcon}>
                <Feather name="check-circle" size={48} color={t.primary} />
              </View>
              <Text style={detailStyles.healthyTitle}>¡Tu planta está sana!</Text>
              <Text style={[detailStyles.healthySubtitle, { color: t.textSecondary }]}>
                No se detectaron enfermedades ni plagas visibles.
              </Text>
              <Text style={[detailStyles.dateText, { color: t.textSecondary }]}>{date}</Text>
            </View>
          ) : (
            <View style={detailStyles.body}>
              <View style={detailStyles.problemHeader}>
                <Text style={[detailStyles.problemName, { color: t.textPrimary }]}>{diagnosis.name}</Text>
                <View style={[detailStyles.severityBadge, { backgroundColor: SEVERITY_COLOR[diagnosis.severity] ?? "#888" }]}>
                  <Text style={detailStyles.severityText}>{diagnosis.severity}</Text>
                </View>
              </View>

              <View style={detailStyles.metaRow}>
                <View style={[detailStyles.typePill, { backgroundColor: t.primarySoft }]}>
                  <Text style={[detailStyles.typePillText, { color: t.textSecondary }]}>{TYPE_LABEL[diagnosis.type] ?? diagnosis.type}</Text>
                </View>
                <Text style={[detailStyles.confidenceText, { color: t.textSecondary }]}>{diagnosis.confidence}% confianza</Text>
                <Text style={[detailStyles.dateText, { color: t.textSecondary }]}>{date}</Text>
              </View>

              {diagnosis.affectedArea ? (
                <View style={[detailStyles.infoBlock, { backgroundColor: t.primarySoft }]}>
                  <Text style={[detailStyles.infoLabel, { color: t.textSecondary }]}>Zona afectada</Text>
                  <Text style={[detailStyles.infoText, { color: t.textPrimary }]}>{diagnosis.affectedArea}</Text>
                </View>
              ) : null}

              <View style={[detailStyles.infoBlock, { backgroundColor: t.primarySoft }]}>
                <Text style={[detailStyles.infoLabel, { color: t.textSecondary }]}>Descripción</Text>
                <Text style={[detailStyles.infoText, { color: t.textPrimary }]}>{diagnosis.description}</Text>
              </View>

              <View style={[detailStyles.infoBlock, detailStyles.treatmentBlock, { backgroundColor: t.primaryPale, borderColor: t.primaryLight }]}>
                <Feather name="activity" size={14} color={t.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[detailStyles.infoLabel, { color: t.textSecondary }]}>Tratamiento</Text>
                  <Text style={[detailStyles.infoText, { color: t.textPrimary }]}>{diagnosis.treatment}</Text>
                </View>
              </View>

              {diagnosis.product ? (
                <View style={[detailStyles.infoBlock, detailStyles.productBlock]}>
                  <Feather name="shopping-bag" size={14} color="#7C3AED" />
                  <View style={{ flex: 1 }}>
                    <Text style={[detailStyles.infoLabel, { color: t.textSecondary }]}>Producto recomendado</Text>
                    <Text style={[detailStyles.infoText, { color: t.textPrimary }]}>{diagnosis.product}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>

        <View style={[detailStyles.actions, { borderTopColor: t.border }]}>
          <TouchableOpacity onPress={onClose} style={[detailStyles.closeBtn, { backgroundColor: t.primary }]}>
            <Text style={detailStyles.closeBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function DiagnosisCard({ diagnosis, onPress }: { diagnosis: LocalDiagnosis; onPress: () => void }) {
  const { theme } = useTheme();
  const t = theme.colors;
  const date = new Date(diagnosis.createdAt).toLocaleDateString("es-CR", {
    day: "numeric", month: "short", year: "numeric",
  });

  if (diagnosis.isHealthy) {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: t.surface, borderColor: "#BBF7D0" }]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <View style={[styles.cardPhoto, styles.cardPhotoPlaceholder, { backgroundColor: "#F0FDF4" }]}>
          <Feather name="check-circle" size={28} color="#16A34A" />
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.cardName, { color: "#16A34A" }]} numberOfLines={1}>
            Planta sana
          </Text>
          <Text style={[styles.cardScientific, { color: t.textSecondary }]}>{date}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {diagnosis.photoUri ? (
        <Image source={{ uri: diagnosis.photoUri }} style={styles.cardPhoto} resizeMode="cover" />
      ) : (
        <View style={[styles.cardPhoto, styles.cardPhotoPlaceholder, { backgroundColor: t.border }]}>
          <Feather name="image" size={28} color={t.textSecondary} />
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.diagnosisHeader}>
          <Text style={[styles.cardName, { color: t.textPrimary, flex: 1 }]} numberOfLines={1}>
            {diagnosis.name}
          </Text>
          <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLOR[diagnosis.severity] ?? "#888" }]}>
            <Text style={styles.severityText}>{diagnosis.severity}</Text>
          </View>
        </View>
        <Text style={[styles.cardScientific, { color: t.textSecondary }]}>{date}</Text>
        {diagnosis.description ? (
          <Text style={[styles.metaText, { color: t.textSecondary, marginTop: 2 }]} numberOfLines={2}>
            {diagnosis.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

// ── Shared swipeable wrapper ──────────────────────────────────────────────────

function DeleteAction({ onDelete }: { onDelete: () => void }) {
  return (
    <TouchableOpacity onPress={onDelete} style={styles.deleteAction}>
      <Feather name="trash-2" size={22} color="#fff" />
    </TouchableOpacity>
  );
}

function SwipeableItem({ onDelete, children }: { onDelete: () => void; children: React.ReactNode }) {
  const swipeRef = useRef<Swipeable>(null);
  const handleDelete = () => {
    swipeRef.current?.close();
    onDelete();
  };
  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={() => <DeleteAction onDelete={handleDelete} />}
    >
      {children}
    </Swipeable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const { theme } = useTheme();
  const t = theme.colors;
  const { user } = useAuth();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const { plants, isLoading, refresh, removePlant } = usePlantStorage(user?.id ?? "user-1");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("plants");
  const [diagnoses, setDiagnoses] = useState<LocalDiagnosis[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<LocalDiagnosis | null>(null);

  const userId = user?.id ?? "user-1";

  useFocusEffect(
    useCallback(() => {
      refresh();
      getDiagnoses(userId).then(setDiagnoses);
      if (tabParam === "diseases") setActiveTab("diseases");
    }, [refresh, tabParam, userId])
  );

  const q = query.toLowerCase().trim();
  const filtered = q
    ? plants.filter(
        (p) => p.commonName.toLowerCase().includes(q) || p.scientificName.toLowerCase().includes(q)
      )
    : plants;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#08200F" }]}>
        <MonsteraLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Header />

      {/* Tab selector */}
      <View style={[styles.tabSelector, { borderBottomColor: t.border }]}>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === "plants" && { backgroundColor: t.primary }]}
          onPress={() => setActiveTab("plants")}
          activeOpacity={0.8}
        >
          <Feather
            name="feather"
            size={13}
            color={activeTab === "plants" ? "#fff" : t.textSecondary}
          />
          <Text style={[styles.tabPillText, { color: activeTab === "plants" ? "#fff" : t.textSecondary }]}>
            Mis Plantas
          </Text>
          {plants.length > 0 && (
            <View style={[styles.tabCount, { backgroundColor: activeTab === "plants" ? "rgba(255,255,255,0.25)" : t.border }]}>
              <Text style={[styles.tabCountText, { color: activeTab === "plants" ? "#fff" : t.textSecondary }]}>
                {plants.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === "diseases" && { backgroundColor: "#C62828" }]}
          onPress={() => setActiveTab("diseases")}
          activeOpacity={0.8}
        >
          <Feather
            name="activity"
            size={13}
            color={activeTab === "diseases" ? "#fff" : t.textSecondary}
          />
          <Text style={[styles.tabPillText, { color: activeTab === "diseases" ? "#fff" : t.textSecondary }]}>
            Enfermedades
          </Text>
          {diagnoses.length > 0 && (
            <View style={[styles.tabCount, { backgroundColor: activeTab === "diseases" ? "rgba(255,255,255,0.25)" : t.border }]}>
              <Text style={[styles.tabCountText, { color: activeTab === "diseases" ? "#fff" : t.textSecondary }]}>
                {diagnoses.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Plants content */}
      {activeTab === "plants" && (
        <>
          <View style={[styles.searchBar, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Feather name="search" size={16} color={t.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: t.textPrimary }]}
              placeholder="Buscar planta..."
              placeholderTextColor={t.textSecondary}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>

          {plants.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="feather" size={56} color={t.textSecondary} />
              <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>
                Aún no tienes plantas
              </Text>
              <Text style={[styles.emptySubtitle, { color: t.textSecondary }]}>
                Usa la cámara para identificar y agregar tu primera planta
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.localId}
              renderItem={({ item }) => (
                <SwipeableItem onDelete={() => removePlant(item.localId)}>
                  <PlantCard plant={item} />
                </SwipeableItem>
              )}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* Diseases content */}
      {activeTab === "diseases" && (
        <>
          {diagnoses.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="activity" size={56} color={t.textSecondary} />
              <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>
                Sin diagnósticos aún
              </Text>
              <Text style={[styles.emptySubtitle, { color: t.textSecondary }]}>
                Usa el Doctor de Plantas para diagnosticar enfermedades y plagas
              </Text>
            </View>
          ) : (
            <FlatList
              data={diagnoses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SwipeableItem
                  onDelete={async () => {
                    await removeDiagnosis(userId, item.id);
                    setDiagnoses((prev) => prev.filter((d) => d.id !== item.id));
                  }}
                >
                  <DiagnosisCard diagnosis={item} onPress={() => setSelectedDiagnosis(item)} />
                </SwipeableItem>
              )}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
      <DiagnosisDetailModal
        diagnosis={selectedDiagnosis}
        onClose={() => setSelectedDiagnosis(null)}
      />
    </SafeAreaView>
  );
}

const detailStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingBottom: 16 },
  photo: { width: "100%", height: 260 },
  body: { padding: 20, gap: 16 },
  centerIcon: { alignItems: "center", paddingTop: 8 },
  healthyTitle: { fontSize: 22, fontWeight: "700", color: "#16A34A", textAlign: "center" },
  healthySubtitle: { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 20 },
  problemHeader: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  problemName: { fontSize: 20, fontWeight: "700", color: "#1A2A1A", flex: 1 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  severityText: { color: "#fff", fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  typePill: { backgroundColor: "#F3F4F6", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  typePillText: { fontSize: 12, color: "#555", fontWeight: "500" },
  confidenceText: { fontSize: 12, color: "#888" },
  dateText: { fontSize: 12, color: "#aaa" },
  infoBlock: { backgroundColor: "#F9FAFB", borderRadius: 12, padding: 14, gap: 6 },
  treatmentBlock: { flexDirection: "row", gap: 10, backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#BBF7D0" },
  productBlock: { flexDirection: "row", gap: 10, backgroundColor: "#F5F3FF", borderWidth: 1, borderColor: "#DDD6FE" },
  infoLabel: { fontSize: 11, fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: 0.5 },
  infoText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  actions: { padding: 16, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  closeBtn: { paddingVertical: 13, borderRadius: 12, backgroundColor: "#1B4332", alignItems: "center" },
  closeBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Tab selector
  tabSelector: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabPillText: { fontSize: 13, fontWeight: "600" },
  tabCount: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tabCountText: { fontSize: 11, fontWeight: "700" },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },

  // List
  list: { padding: 16, gap: 12 },

  // Card (shared)
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardPhoto: { width: 90, height: 90 },
  cardPhotoPlaceholder: { justifyContent: "center", alignItems: "center" },
  cardBody: { flex: 1, padding: 12, justifyContent: "center", gap: 4 },
  cardName: { fontSize: 16, fontWeight: "600" },
  cardScientific: { fontSize: 13, fontStyle: "italic" },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  metaText: { fontSize: 12, flexShrink: 1 },

  // Toxicity
  toxicBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  toxicBadgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },

  // Diagnosis extras
  diagnosisHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  severityText: { color: "#fff", fontSize: 10, fontWeight: "700", textTransform: "capitalize" },

  // Delete
  deleteAction: {
    width: 80,
    backgroundColor: "#C62828",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },

  // Empty
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
