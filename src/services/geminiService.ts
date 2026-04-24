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

const PROMPT =
  'You are a plant identification expert. Analyze this image and respond ONLY with valid JSON ' +
  'matching this exact schema (no markdown, no extra text): ' +
  '{"isPlant":true,"commonName":"string","scientificName":"string","confidence":85,' +
  '"watering":"string","sunlight":"string","soil":"string"}. ' +
  'If the image is not a plant, set isPlant to false and use empty strings for the other fields.';

export async function identifyPlant(photoUri: string): Promise<PlantIdentificationResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not set');

  const base64 = await FileSystem.readAsStringAsync(photoUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          { text: PROMPT },
          { inlineData: { mimeType: 'image/jpeg', data: base64 } },
        ],
      },
    ],
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${text}`);
  }

  const json = await response.json();
  const rawText: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // Strip possible markdown code fences
  const cleaned = rawText.replace(/^```json?\n?/, '').replace(/```$/, '').trim();

  try {
    return JSON.parse(cleaned) as PlantIdentificationResult;
  } catch {
    throw new Error('No se pudo interpretar la respuesta de identificación de planta.');
  }
}
