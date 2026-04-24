import * as FileSystem from 'expo-file-system/legacy';

export interface PlantIdentificationResult {
  isPlant: boolean;
  commonName: string;
  scientificName: string;
  confidence: number;   // 0–100
  watering: string;
  sunlight: string;
  soil: string;
}

const DETAILS = 'common_names,watering,best_light_condition,best_soil_type';

function formatWatering(watering: unknown): string {
  if (!watering) return 'No disponible';
  if (typeof watering === 'string') return watering;
  if (typeof watering === 'object' && watering !== null) {
    const w = watering as { min?: number; max?: number; text?: string };
    if (w.text) return w.text;
    if (w.min !== undefined && w.max !== undefined) {
      return `${w.min}–${w.max} veces por semana`;
    }
  }
  return 'No disponible';
}

export async function identifyPlant(
  photoUri: string,
  preloadedBase64?: string
): Promise<PlantIdentificationResult> {
  const apiKey = process.env.EXPO_PUBLIC_PLANT_ID_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_PLANT_ID_KEY no está configurada en .env');

  let base64: string;
  if (preloadedBase64) {
    base64 = preloadedBase64;
  } else if (photoUri.startsWith('data:')) {
    base64 = photoUri.split(',')[1];
  } else {
    base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  const endpoint = `https://plant.id/api/v3/identification?details=${DETAILS}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      images: [`data:image/jpeg;base64,${base64}`],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Plant.id API error ${response.status}: ${text}`);
  }

  const json = await response.json();

  // Use suggestions directly — more reliable than is_plant.binary which has a strict 0.5 threshold
  const top = json?.result?.classification?.suggestions?.[0];
  const isPlantProbability: number = json?.result?.is_plant?.probability ?? 0;

  // Only reject if API is highly confident it's not a plant AND no suggestions returned
  if (!top && isPlantProbability < 0.2) {
    return {
      isPlant: false,
      commonName: '',
      scientificName: '',
      confidence: Math.round(isPlantProbability * 100),
      watering: '',
      sunlight: '',
      soil: '',
    };
  }

  if (!top) throw new Error('No se encontraron sugerencias de identificación.');

  const details = top.details ?? {};
  const commonNames: string[] = details.common_names ?? [];

  return {
    isPlant: true,
    commonName: commonNames[0] ?? top.name,
    scientificName: top.name ?? '',
    confidence: Math.round((top.probability ?? 0) * 100),
    watering: formatWatering(details.watering),
    sunlight: details.best_light_condition ?? 'No disponible',
    soil: details.best_soil_type ?? 'No disponible',
  };
}
