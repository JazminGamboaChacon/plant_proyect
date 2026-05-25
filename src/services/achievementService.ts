import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadPlants } from './plantStorageService';
import { getCareHistory } from './careService';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000';

const ACHIEVEMENT_LABELS: Record<string, string> = {
  primera_planta:    'Primera Planta',
  coleccionista:     'Coleccionista',
  explorador:        'Explorador',
  en_racha:          'En Racha',
  manos_a_la_tierra: 'Manos a la Tierra',
  jardinero_florido: 'Jardinero Florido',
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) return { Authorization: `Bearer ${token}` };
  } catch {}
  return {};
}

async function fetchEarnedKeys(userId: string): Promise<Set<string>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/users/${userId}/achievements`, { headers });
    if (!res.ok) return new Set();
    const data: Array<{ key: string; earned: boolean }> = await res.json();
    return new Set(data.filter((a) => a.earned).map((a) => a.key));
  } catch {
    return new Set();
  }
}

async function unlockOnBackend(userId: string, achievementKey: string): Promise<string | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/users/${userId}/achievements/unlock`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ achievementKey }),
    });
    if (!res.ok) return null;
    const data: { alreadyEarned: boolean; label?: string } = await res.json();
    if (data.alreadyEarned) return null;
    return data.label ?? ACHIEVEMENT_LABELS[achievementKey] ?? achievementKey;
  } catch {
    return null;
  }
}

function hasSevenConsecutiveDays(history: Array<{ doneAt: string }>): boolean {
  const days = [
    ...new Set(history.map((e) => e.doneAt.slice(0, 10))),
  ].sort();
  if (days.length < 7) return false;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff =
      (new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) /
      86_400_000;
    if (Math.round(diff) === 1) {
      if (++streak >= 7) return true;
    } else {
      streak = 1;
    }
  }
  return false;
}

export async function checkAndUnlock(userId: string): Promise<string[]> {
  try {
    const [allPlants, history, earnedKeys] = await Promise.all([
      loadPlants(userId),
      getCareHistory(userId),
      fetchEarnedKeys(userId),
    ]);

    const plants = allPlants;

    const toCheck: Array<{ key: string; condition: boolean }> = [
      { key: 'primera_planta',     condition: plants.length >= 1 },
      { key: 'coleccionista',      condition: plants.length >= 5 },
      { key: 'explorador',         condition: plants.some((p) => (p.confidence ?? 0) > 0) },
      { key: 'manos_a_la_tierra',  condition: history.some((e) => e.triggeredBy === 'shake') },
      { key: 'en_racha',           condition: hasSevenConsecutiveDays(history) },
      { key: 'jardinero_florido',  condition: history.length >= 10 },
    ];

    const newlyUnlocked: string[] = [];

    for (const { key, condition } of toCheck) {
      if (!condition || earnedKeys.has(key)) continue;
      const label = await unlockOnBackend(userId, key);
      if (label) {
        newlyUnlocked.push(label);
      }
    }

    return newlyUnlocked;
  } catch {
    return [];
  }
}
