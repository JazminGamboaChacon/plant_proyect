import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalPlant, PlantCare, CareType, CareHistoryEntry } from '../types-dtos/plant.types';
import { getLunarPhase } from '../utils/lunarPhase';
import { updatePlantCare } from './plantStorageService';

const DEFAULT_CARE: PlantCare = {
  waterFreqDays: 3,
  lastWatered: null,
  fertilizeFreqDays: 30,
  lastFertilized: null,
  pruneFreqDays: 60,
  lastPruned: null,
  lightType: 'mixto',
  careNotes: '',
};

const HISTORY_KEY = (userId: string) => `@care_history_${userId}`;

function isDue(lastDate: string | null, freqDays: number, today: Date): boolean {
  if (!lastDate) return true;
  const daysSince = (today.getTime() - new Date(lastDate).getTime()) / 86_400_000;
  return daysSince >= freqDays;
}

export function getPendingCareTypes(plant: LocalPlant, today = new Date()): CareType[] {
  const care = plant.care ?? DEFAULT_CARE;
  const pending: CareType[] = [];
  if (isDue(care.lastWatered, care.waterFreqDays, today)) pending.push('riego');
  if (isDue(care.lastFertilized, care.fertilizeFreqDays, today)) pending.push('abono');
  if (isDue(care.lastPruned, care.pruneFreqDays, today)) pending.push('poda');
  return pending;
}

export async function getCareHistory(userId: string): Promise<CareHistoryEntry[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY(userId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CareHistoryEntry[];
  } catch {
    return [];
  }
}

export async function recordCare(
  plant: LocalPlant,
  careType: CareType,
  triggeredBy: 'manual' | 'shake' | 'notification',
  userId: string,
): Promise<LocalPlant> {
  const now = new Date();
  const phase = getLunarPhase(now);

  const entry: CareHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    plantId: plant.localId,
    plantName: plant.commonName,
    careType,
    doneAt: now.toISOString(),
    lunarPhase: phase.name,
    triggeredBy,
  };

  const history = await getCareHistory(userId);
  history.unshift(entry);
  await AsyncStorage.setItem(HISTORY_KEY(userId), JSON.stringify(history));

  const care: PlantCare = {
    ...(plant.care ?? DEFAULT_CARE),
    ...(careType === 'riego'  ? { lastWatered:    now.toISOString() } : {}),
    ...(careType === 'abono'  ? { lastFertilized: now.toISOString() } : {}),
    ...(careType === 'poda'   ? { lastPruned:     now.toISOString() } : {}),
  };

  await updatePlantCare(userId, plant.localId, care);
  const updatedPlant: LocalPlant = { ...plant, care };
  return updatedPlant;
}
