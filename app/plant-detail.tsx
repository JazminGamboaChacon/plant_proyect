import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../src/context/ThemeContext";
import { loadPlants } from "../src/services/plantStorageService";
import { LocalPlant } from "../src/types-dtos/plant.types";

const PHOTO_HEIGHT = Dimensions.get("window").height * 0.38;

function InfoRow({
  icon,
  label,
  value,
  textColor,
  secondaryColor,
  borderColor,
}: {
  icon: string;
  label: string;
  value: string;
  textColor: string;
  secondaryColor: string;
  borderColor: string;
}) {
  return (
    <View style={[styles.infoCard, { borderColor }]}>
      <Feather name={icon as any} size={18} color={secondaryColor} />
      <Text style={[styles.infoLabel, { color: secondaryColor }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

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
    <View style={[styles.badge, { backgroundColor: isToxic ? "#C62828" : "#2E7D32" }]}>
      <Text style={styles.badgeText}>{isToxic ? "Tóxica" : "No tóxica"}</Text>
    </View>
  );
}

export default function PlantDetailScreen() {
  const { localId } = useLocalSearchParams<{ localId: string }>();
  const { theme } = useTheme();
  const t = theme.colors;

  const [plant, setPlant] = useState<LocalPlant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const plants = await loadPlants();
      setPlant(plants.find((p) => p.localId === localId) ?? null);
      setLoading(false);
    })();
  }, [localId]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: t.background }]}>
        <ActivityIndicator size="large" color={t.primary} />
      </View>
    );
  }

  if (!plant) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: t.background }]}>
        <Feather name="alert-circle" size={48} color={t.textSecondary} />
        <Text style={[styles.notFound, { color: t.textPrimary }]}>
          Planta no encontrada
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: t.primary }}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      {/* Foto de cabecera */}
      {plant.localPhotoUri ? (
        <Image
          source={{ uri: plant.localPhotoUri }}
          style={styles.photo}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder, { backgroundColor: t.border }]}>
          <Feather name="image" size={40} color={t.textSecondary} />
        </View>
      )}

      {/* Botón volver sobre la foto */}
      <SafeAreaView style={styles.backOverlay} edges={["top"]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.45)" }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={[styles.sheetContent, { backgroundColor: t.surface }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Nombres */}
        <Text style={[styles.commonName, { color: t.textPrimary }]}>
          {plant.commonName}
        </Text>
        <Text style={[styles.scientificName, { color: t.textSecondary }]}>
          {plant.scientificName}
        </Text>
        {plant.family && plant.family !== "No disponible" && (
          <Text style={[styles.family, { color: t.textSecondary }]}>
            Familia: {plant.family}
          </Text>
        )}

        {/* Badges */}
        <View style={styles.badgeRow}>
          {plant.confidence > 0 && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    plant.confidence >= 75
                      ? "#2E7D32"
                      : plant.confidence >= 50
                      ? "#F9A825"
                      : "#E65100",
                },
              ]}
            >
              <Text style={styles.badgeText}>{plant.confidence}% confianza</Text>
            </View>
          )}
          <ToxicityBadge value={plant.toxicity} />
        </View>

        {/* Cuidados */}
        <View style={styles.careRow}>
          <InfoRow
            icon="droplet"
            label="Riego"
            value={plant.watering || "No disponible"}
            textColor={t.textPrimary}
            secondaryColor={t.textSecondary}
            borderColor={t.border}
          />
          <InfoRow
            icon="sun"
            label="Luz"
            value={plant.sunlight || "No disponible"}
            textColor={t.textPrimary}
            secondaryColor={t.textSecondary}
            borderColor={t.border}
          />
          <InfoRow
            icon="layers"
            label="Sustrato"
            value={plant.soil || "No disponible"}
            textColor={t.textPrimary}
            secondaryColor={t.textSecondary}
            borderColor={t.border}
          />
        </View>

        {/* Descripción */}
        {plant.description && plant.description !== "No disponible" && (
          <View style={[styles.descriptionBox, { backgroundColor: t.background }]}>
            <Text style={[styles.sectionLabel, { color: t.textSecondary }]}>
              Descripción
            </Text>
            <Text style={[styles.descriptionText, { color: t.textPrimary }]}>
              {plant.description}
            </Text>
          </View>
        )}

        {/* Fecha */}
        <Text style={[styles.date, { color: t.textSecondary }]}>
          Agregada el{" "}
          {new Date(plant.createdAt).toLocaleDateString("es-CR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  notFound: {
    fontSize: 16,
  },
  photo: {
    width: "100%",
    height: PHOTO_HEIGHT,
  },
  photoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  backOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    flex: 1,
  },
  sheetContent: {
    padding: 20,
    gap: 10,
    flexGrow: 1,
  },
  commonName: {
    fontSize: 26,
    fontWeight: "700",
  },
  scientificName: {
    fontSize: 15,
    fontStyle: "italic",
    marginTop: -4,
  },
  family: {
    fontSize: 13,
    fontStyle: "italic",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  careRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 12,
    textAlign: "center",
  },
  descriptionBox: {
    borderRadius: 10,
    padding: 12,
    gap: 6,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  date: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "right",
  },
});
