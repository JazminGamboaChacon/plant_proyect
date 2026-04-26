const API_BASE = process.env.EXPO_PUBLIC_API_URL;

async function apiFetch<T>(path: string): Promise<T> {
  if (!API_BASE) throw new Error("EXPO_PUBLIC_API_URL no definida en .env");
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

async function apiMutate<T>(
  path: string,
  method: "PUT" | "POST" | "DELETE",
  body?: unknown,
): Promise<T> {
  if (!API_BASE) throw new Error("EXPO_PUBLIC_API_URL no definida en .env");
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail || `API error ${res.status}: ${path}`);
  }
  return res.json();
}

export type UserUpdatePayload = {
  username?: string;
  fullName?: string;
  birthday?: string;
  photoURL?: string | null;
  isPublicProfile?: boolean;
  favoritePlantTypes?: string[];
};

export type PlantUpdatePayload = {
  commonName?: string;
  scientificName?: string;
  photoURL?: string | null;
  type?: string;
  groupId?: string;
  isFavorite?: boolean;
  notes?: string;
};

export function updateUser(
  userId: string,
  data: UserUpdatePayload,
): Promise<ApiUser> {
  return apiMutate(`/api/users/${userId}`, "PUT", data);
}

export function updatePlant(
  plantId: string,
  data: PlantUpdatePayload,
): Promise<ApiPlant> {
  return apiMutate(`/api/plants/${plantId}`, "PUT", data);
}

export function fetchPlantDetail(plantId: string): Promise<ApiPlant> {
  return apiFetch(`/api/plants/${plantId}`);
}

export function fetchUserProfile(
  userId: string,
): Promise<ApiUserProfileResponse> {
  return apiFetch(`/api/users/${userId}/profile`);
}

export function fetchUserPlants(userId: string): Promise<ApiPlant[]> {
  return apiFetch(`/api/users/${userId}/plants`);
}

export function fetchPlantTypes(): Promise<ApiPlantType[]> {
  return apiFetch("/api/plant-types");
}

export type PlantCreatePayload = {
  userId: string;
  commonName: string;
  scientificName: string;
  photoURL?: string | null;
  type: string;
  groupId: string;
  isFavorite?: boolean;
  notes?: string;
};

export function createPlant(data: PlantCreatePayload): Promise<ApiPlant> {
  return apiMutate("/api/plants", "POST", data);
}

