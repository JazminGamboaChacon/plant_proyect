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
    "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=200&h=200&fit=crop",
  herbs:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop",
  cacti:
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop",
  ferns:
    "https://images.unsplash.com/photo-1597305877032-0668b3c6413a?w=200&h=200&fit=crop",
};

function formatBirthday(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
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
    name: pt.label,
    count: plantCountByType[pt.id] || 0,
  }));

  // Map achievements
  const mappedAchievements = achievements.map((a) => ({
    iconName: (ICON_MAP[a.icon] || "help-outline") as IoniconsName,
    label: a.label,
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

  // Profile completion: count filled fields
  const fields = [
    user.fullName,
    user.email,
    user.username,
    user.birthday,
    user.photoURL,
  ];
  const filled = fields.filter((f) => f !== null && f !== "").length;
  const profileCompletion = Math.round((filled / fields.length) * 100);

  return {
    name: user.fullName,
    handle: `@${user.username}`,
    avatarUrl: user.photoURL || "",
    bio: "",
    birthday: formatBirthday(user.birthday),
    streak: user.stats.daysActive,
    friends: 0,
    plants: user.stats.totalPlants,
    favoritePlant,
    categories,
    achievements: mappedAchievements,
    profileCompletion,
    plantOfTheDay: null,
    plantsList,
  };
}

export function useUserProfile(userId: string) {
  const [data, setData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [userId]);

  return { data, loading, error };
}
