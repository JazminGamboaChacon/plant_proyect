import { Platform } from "react-native";

const API_BASE =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json();
}

export type ApiUserStats = {
  totalPlants: number;
  totalAchievements: number;
  daysActive: number;
};

export type ApiUser = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  birthday: string;
  photoURL: string | null;
  isPublicProfile: boolean;
  favoritePlantTypes: string[];
  stats: ApiUserStats;
  createdAt: string;
};

export type ApiPlant = {
  id: string;
  userId: string;
  commonName: string;
  scientificName: string;
  photoURL: string | null;
  type: string;
  groupId: string;
  isFavorite: boolean;
  notes: string;
  createdAt: string;
};

export type ApiGroup = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
};

export type ApiPlantType = {
  id: string;
  label: string;
  icon: string;
  lib: string;
};

export type ApiAchievement = {
  id: string;
  key: string;
  label: string;
  description: string;
  icon: string;
  earned: boolean;
};

export type ApiUserProfileResponse = {
  user: ApiUser;
  plants: ApiPlant[];
  groups: ApiGroup[];
  plantTypes: ApiPlantType[];
  achievements: ApiAchievement[];
};

export type AuthResponse = {
  user: ApiUser;
  token: string;
  is_new_user: boolean;
};

export async function authGoogleSignIn(
  idToken: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });
  if (!res.ok) {
    throw new Error(`Auth error ${res.status}`);
  }
  return res.json();
}

export function fetchUserProfile(
  userId: string
): Promise<ApiUserProfileResponse> {
  return apiFetch(`/api/users/${userId}/profile`);
}

export function fetchUserPlants(userId: string): Promise<ApiPlant[]> {
  return apiFetch(`/api/users/${userId}/plants`);
}

export function fetchPlantTypes(): Promise<ApiPlantType[]> {
  return apiFetch("/api/plant-types");
}
