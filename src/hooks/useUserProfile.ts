import { useEffect, useState } from "react";
import {
  ApiUserProfileResponse,
  fetchUserProfile,
} from "../services/api";
import { UserProfileData } from "../types-dtos/user.types";
import type { Ionicons } from "@expo/vector-icons";
import React from "react";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const ICON_MAP: Record<string, IoniconsName> = {
  leaf: "leaf-outline",
  flower: "flower-outline",
  flame: "flame-outline",
  compass: "compass-outline",
  grid: "grid-outline",
};

const PLANT_TYPE_IMAGES: Record<string, string> = {
  succulents:
    "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=200&h=200&fit=crop",
  tropical:
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=200&h=200&fit=crop",
  flowering:
    "https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=200&h=200&fit=crop",
  flower:
    "https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=200&h=200&fit=crop",
  herbs:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop",
  cacti:
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop",
  ferns:
    "https://images.unsplash.com/photo-1597305877032-0668b3c6413a?w=200&h=200&fit=crop",
};

const PLANT_TYPE_LABELS: Record<string, string> = {
  succulents: "Suculentas",
  tropical:   "Tropicales",
  flowering:  "Flores",
  flower:     "Flores",
  herbs:      "Hierbas",
  cacti:      "Cactus",
  ferns:      "Helechos",
};

const ACHIEVEMENT_LABEL_MAP: Record<string, string> = {
  leaf:    "Primera Planta",
  flower:  "Jardinero Florido",
  flame:   "En Racha",
  compass: "Explorador",
  grid:    "Coleccionista",
};

function formatBirthday(value: string): string {
  if (!value || value.trim() === "") return "";
  let date: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date = new Date(value + "T00:00:00");
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [d, m, y] = value.split("/");
    date = new Date(Number(y), Number(m) - 1, Number(d));
  } else {
    return value;
  }
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CR", { month: "long", day: "numeric", year: "numeric" });
}

function mapApiToProfileData(api: ApiUserProfileResponse): UserProfileData {
  const { user, plants, plantTypes, achievements } = api;

  // Build categories from plantTypes + plant count per type
  const plantCountByType: Record<string, number> = {};
  for (const p of plants) {
    plantCountByType[p.type] = (plantCountByType[p.type] || 0) + 1;
  }

  const categories = plantTypes.map((pt) => ({
    imageUrl: PLANT_TYPE_IMAGES[pt.id] || "",
    name: PLANT_TYPE_LABELS[pt.id] || pt.label,
    count: plantCountByType[pt.id] || 0,
    icon: pt.icon,
  }));

  // Map achievements
  const mappedAchievements = achievements.map((a) => ({
    iconName: (ICON_MAP[a.icon] || "help-outline") as IoniconsName,
    label: ACHIEVEMENT_LABEL_MAP[a.icon] || a.label,
    earned: a.earned,
  }));

  // Favorite plant
  const favPlant = plants.find((p) => p.isFavorite) || null;
  const favoritePlant = favPlant
    ? {
        id: favPlant.id,
        name: favPlant.commonName,
        family: favPlant.scientificName,
        since: `Added ${new Date(favPlant.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}`,
        imageUrl: favPlant.photoURL || "",
      }
    : null;

  const plantsList = plants.map((p) => ({
    id: p.id,
    commonName: p.commonName,
    scientificName: p.scientificName,
    type: p.type,
    isFavorite: p.isFavorite,
    photoURL: p.photoURL,
  }));

  return {
    name: user.fullName,
    handle: `@${user.username}`,
    avatarUrl: user.photoURL || "",
    bio: user.bio || "",
    birthday: formatBirthday(user.birthday),
    streak: user.stats.daysActive,
    plants: user.stats.totalPlants,
    favoritePlant,
    categories,
    achievements: mappedAchievements,
    plantOfTheDay: null,
    plantsList,
  };
}

export function useUserProfile(userId: string) {
  const [data, setData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = () => {
    setFetchTrigger((n) => n + 1);
  };

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchUserProfile(userId)
      .then((apiData) => {
        if (!cancelled) {
          setData(mapApiToProfileData(apiData));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId, fetchTrigger]);

  return { data, loading, error, refetch };
}
