import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/context/ThemeContext";
import { usePlantStorage } from "../../src/hooks/usePlantStorage";
import { LocalPlant } from "../../src/types-dtos/plant.types";

function ToxicityBadge({ value }: { value: string }) {
  if (!value || value === "No disponible") return null;
  const lower = value.toLowerCase();
  const isToxic =
    !lower.includes("non-toxic") &&
    !lower.includes("no tóxic") &&
    !lower.includes("not toxic") &&
    (lower.includes("toxic") ||
      lower.includes("tóxic") ||
      lower.includes("poison"));
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
    <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
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
    </View>
  );
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const t = theme.colors;
  const { plants, isLoading, refresh } = usePlantStorage("user-1");

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={[styles.header, { borderBottomColor: t.border }]}>
        <Text style={[styles.title, { color: t.textPrimary }]}>Mi Colección</Text>
        {plants.length > 0 && (
          <View style={[styles.countBadge, { backgroundColor: t.primary }]}>
            <Text style={styles.countText}>{plants.length}</Text>
          </View>
        )}
      </View>

      {!isLoading && plants.length === 0 ? (
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
          data={plants}
          keyExtractor={(item) => item.localId}
          renderItem={({ item }) => <PlantCard plant={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardPhoto: {
    width: 90,
    height: 90,
  },
  cardPhotoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 4,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardScientific: {
    fontSize: 13,
    fontStyle: "italic",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    flexShrink: 1,
  },
  toxicBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  toxicBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
