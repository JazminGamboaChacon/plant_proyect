import AsyncStorage from '@react-native-async-storage/async-storage';

function wateringIntervalDays(watering: string): number {
  const w = watering.toLowerCase();
  if (w.includes('frecuente') || w.includes('daily') || w.includes('diario')) return 2;
  if (w.includes('moderado') || w.includes('regular') || w.includes('weekly')) return 7;
  if (w.includes('escaso') || w.includes('poco') || w.includes('infreq')) return 14;
  const match = w.match(/(\d+)[–\-](\d+)/);
  if (match) {
    const avg = (parseInt(match[1]) + parseInt(match[2])) / 2;
    return Math.round(7 / avg);
  }
  return 7;
}

const CARE_KEY = (localId: string) => `@care_water_${localId}`;
const todayString = () => new Date().toISOString().slice(0, 10);

export async function markWateredToday(localId: string): Promise<void> {
  await AsyncStorage.setItem(CARE_KEY(localId), todayString());
}

export async function getPendingPlants(
  plants: Array<{ localId: string; watering: string }>
): Promise<string[]> {
  const results = await Promise.all(
    plants.map(async (p) => {
      const last = await AsyncStorage.getItem(CARE_KEY(p.localId));
      if (!last) return { localId: p.localId, pending: true };
      const daysSince = (Date.now() - new Date(last).getTime()) / 86_400_000;
      return { localId: p.localId, pending: daysSince >= wateringIntervalDays(p.watering) };
    })
  );
  return results.filter((r) => r.pending).map((r) => r.localId);
}
