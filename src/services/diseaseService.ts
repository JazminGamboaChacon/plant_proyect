import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalDiagnosis } from '../types-dtos/disease.types';
import { persistPhoto } from './plantStorageService';

const KEY = (userId: string) => `@plant_diagnoses_${userId}`;

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export async function getDiagnoses(userId: string): Promise<LocalDiagnosis[]> {
  const raw = await AsyncStorage.getItem(KEY(userId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LocalDiagnosis[];
  } catch {
    return [];
  }
}

export async function saveDiagnosis(
  userId: string,
  data: Omit<LocalDiagnosis, 'id' | 'userId' | 'photoUri' | 'createdAt'>,
  tempPhotoUri: string,
): Promise<LocalDiagnosis> {
  const photoUri = await persistPhoto(tempPhotoUri);
  const diagnosis: LocalDiagnosis = {
    ...data,
    id: generateId(),
    userId,
    photoUri,
    createdAt: new Date().toISOString(),
  };
  const list = await getDiagnoses(userId);
  list.unshift(diagnosis);
  await AsyncStorage.setItem(KEY(userId), JSON.stringify(list));
  return diagnosis;
}

export async function removeDiagnosis(userId: string, id: string): Promise<void> {
  const list = await getDiagnoses(userId);
  const filtered = list.filter((d) => d.id !== id);
  await AsyncStorage.setItem(KEY(userId), JSON.stringify(filtered));
}
