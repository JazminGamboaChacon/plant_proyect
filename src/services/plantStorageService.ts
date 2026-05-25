import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { LocalPlant, LocalPlantDraft, PlantCare } from '../types-dtos/plant.types';

const storageKey = (userId: string) => `@bloomly_plants_${userId}`;
const PHOTO_DIR = FileSystem.documentDirectory + 'bloomly_photos/';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export async function ensurePhotoDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(PHOTO_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
  }
}

export async function persistPhoto(tempUri: string): Promise<string> {
  await ensurePhotoDir();
  const filename = generateId() + '.jpg';
  const dest = PHOTO_DIR + filename;
  await FileSystem.copyAsync({ from: tempUri, to: dest });
  return dest;
}

export async function loadPlants(userId: string): Promise<LocalPlant[]> {
  const raw = await AsyncStorage.getItem(storageKey(userId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LocalPlant[];
  } catch {
    return [];
  }
}

export async function savePlants(userId: string, plants: LocalPlant[]): Promise<void> {
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(plants));
}

export async function addPlant(userId: string, draft: LocalPlantDraft): Promise<LocalPlant> {
  const plants = await loadPlants(userId);
  const plant: LocalPlant = {
    ...draft,
    localId: generateId(),
    serverId: null,
    synced: false,
    syncError: null,
  };
  plants.push(plant);
  await savePlants(userId, plants);
  return plant;
}

export async function markSynced(userId: string, localId: string, serverId: string): Promise<void> {
  const plants = await loadPlants(userId);
  const idx = plants.findIndex((p) => p.localId === localId);
  if (idx !== -1) {
    plants[idx] = { ...plants[idx], synced: true, serverId, syncError: null };
    await savePlants(userId, plants);
  }
}

export async function markSyncError(userId: string, localId: string, error: string): Promise<void> {
  const plants = await loadPlants(userId);
  const idx = plants.findIndex((p) => p.localId === localId);
  if (idx !== -1) {
    plants[idx] = { ...plants[idx], syncError: error };
    await savePlants(userId, plants);
  }
}

export async function getPendingPlants(userId: string): Promise<LocalPlant[]> {
  const plants = await loadPlants(userId);
  return plants.filter((p) => !p.synced);
}

export async function updatePlantCare(userId: string, localId: string, care: PlantCare): Promise<void> {
  const plants = await loadPlants(userId);
  const idx = plants.findIndex((p) => p.localId === localId);
  if (idx !== -1) {
    plants[idx] = { ...plants[idx], care };
    await savePlants(userId, plants);
  }
}

export async function deletePlant(userId: string, localId: string): Promise<void> {
  const plants = await loadPlants(userId);
  const plant = plants.find((p) => p.localId === localId);
  if (plant?.localPhotoUri) {
    const info = await FileSystem.getInfoAsync(plant.localPhotoUri);
    if (info.exists) await FileSystem.deleteAsync(plant.localPhotoUri, { idempotent: true });
  }
  await savePlants(userId, plants.filter((p) => p.localId !== localId));
}
