import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { LocalPlant, LocalPlantDraft } from '../types-dtos/plant.types';

const STORAGE_KEY = '@bloomly_plants';
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

export async function loadPlants(): Promise<LocalPlant[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LocalPlant[];
  } catch {
    return [];
  }
}

export async function savePlants(plants: LocalPlant[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}

export async function addPlant(draft: LocalPlantDraft): Promise<LocalPlant> {
  const plants = await loadPlants();
  const plant: LocalPlant = {
    ...draft,
    localId: generateId(),
    serverId: null,
    synced: false,
    syncError: null,
  };
  plants.push(plant);
  await savePlants(plants);
  return plant;
}

export async function markSynced(localId: string, serverId: string): Promise<void> {
  const plants = await loadPlants();
  const idx = plants.findIndex((p) => p.localId === localId);
  if (idx !== -1) {
    plants[idx] = { ...plants[idx], synced: true, serverId, syncError: null };
    await savePlants(plants);
  }
}

export async function markSyncError(localId: string, error: string): Promise<void> {
  const plants = await loadPlants();
  const idx = plants.findIndex((p) => p.localId === localId);
  if (idx !== -1) {
    plants[idx] = { ...plants[idx], syncError: error };
    await savePlants(plants);
  }
}

export async function getPendingPlants(): Promise<LocalPlant[]> {
  const plants = await loadPlants();
  return plants.filter((p) => !p.synced);
}

export async function deletePlant(localId: string): Promise<void> {
  const plants = await loadPlants();
  const plant = plants.find((p) => p.localId === localId);
  if (plant?.localPhotoUri) {
    const info = await FileSystem.getInfoAsync(plant.localPhotoUri);
    if (info.exists) await FileSystem.deleteAsync(plant.localPhotoUri, { idempotent: true });
  }
  await savePlants(plants.filter((p) => p.localId !== localId));
}
