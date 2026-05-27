import * as FileSystem from "expo-file-system/legacy";

export interface GeminiCare {
  wateringFrequencyDays: number;
  fertilizingFrequencyDays: number;
  pruningFrequencyDays: number;
  sunlight: "sol" | "sombra" | "mixto";
  careNotes: string;
}

export interface PlantIdentificationResult {
  isPlant: boolean;
  commonName: string;
  scientificName: string;
  confidence: number;
  family: string;
  description: string;
  toxicity: string;
  watering: string;
  sunlight: string;
  soil: string;
  plantType: string;
  care: GeminiCare;
}


const DEFAULT_CARE: GeminiCare = {
  wateringFrequencyDays: 3,
  fertilizingFrequencyDays: 30,
  pruningFrequencyDays: 60,
  sunlight: "mixto",
  careNotes: "",
};

const PROMPT =
  "Analiza la imagen y responde ÚNICAMENTE con un JSON válido, sin texto extra, sin backticks, sin explicaciones.\n\n" +
  'Si no hay una planta en la imagen responde:\n{ "isPlant": false }\n\n' +
  "Si sí hay una planta responde con este formato exacto:\n" +
  "{\n" +
  '  "isPlant": true,\n' +
  '  "confidence": número entre 0 y 1,\n' +
  '  "commonName": "nombre común en español",\n' +
  '  "scientificName": "nombre científico",\n' +
  '  "family": "familia botánica en español",\n' +
  '  "description": "descripción en español de 2-3 oraciones",\n' +
  '  "toxicity": "tóxica" | "no tóxica" | "No disponible",\n' +
  '  "watering": "descripción del riego en español (ej: Moderado, 1-2 veces por semana)",\n' +
  '  "sunlight": "descripción de luz en español (ej: Luz indirecta brillante)",\n' +
  '  "soil": "tipo de sustrato en español (ej: Sustrato drenante con arena)",\n' +
  '  "plantType": una de estas opciones exactas: "succulents" | "cacti" | "tropical" | "flowering" | "herbs" | "ferns" | "other",\n' +
  '  "care": {\n' +
  '    "wateringFrequencyDays": número entero de días entre riegos,\n' +
  '    "fertilizingFrequencyDays": número entero de días entre abonos,\n' +
  '    "pruningFrequencyDays": número entero de días entre podas,\n' +
  '    "sunlight": "sol" | "sombra" | "mixto",\n' +
  '    "careNotes": "consejo corto de cuidado general en español"\n' +
  "  }\n" +
  "}";

export async function identifyPlant(
  photoUri: string,
  preloadedBase64?: string,
): Promise<PlantIdentificationResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_ID_KEY;
  if (!apiKey)
    throw new Error("EXPO_PUBLIC_GEMINI_ID_KEY no está configurada en .env");

  let base64: string;
  if (preloadedBase64) {
    base64 = preloadedBase64;
  } else if (photoUri.startsWith("data:")) {
    base64 = photoUri.split(",")[1];
  } else {
    base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "applicationp/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: PROMPT },
            { inlineData: { mimeType: "image/jpeg", data: base64 } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const rawText: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error(
        "Gemini no devolvió un JSON válido. Intenta con otra foto.",
      );
    }
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      throw new Error(
        "No se pudo interpretar la respuesta de Gemini. Intenta con otra foto.",
      );
    }
  }

  if (!parsed.isPlant) {
    return {
      isPlant: false,
      commonName: "",
      scientificName: "",
      confidence: 0,
      family: "",
      description: "",
      toxicity: "",
      watering: "",
      sunlight: "",
      soil: "",
      plantType: "other",
      care: DEFAULT_CARE,
    };
  }

  const rawCare = (parsed.care as Record<string, unknown>) ?? {};
  const careSunlight = String(rawCare.sunlight ?? "");

  return {
    isPlant: true,
    commonName: String(parsed.commonName ?? ""),
    scientificName: String(parsed.scientificName ?? ""),
    confidence: Math.round(Number(parsed.confidence ?? 0) * 100),
    family: String(parsed.family ?? "No disponible"),
    description: String(parsed.description ?? "No disponible"),
    toxicity: String(parsed.toxicity ?? "No disponible"),
    watering: String(parsed.watering ?? "No disponible"),
    sunlight: String(parsed.sunlight ?? "No disponible"),
    soil: String(parsed.soil ?? "No disponible"),
    plantType: String(parsed.plantType ?? "other"),
    care: {
      wateringFrequencyDays: Number(
        rawCare.wateringFrequencyDays ?? DEFAULT_CARE.wateringFrequencyDays,
      ),
      fertilizingFrequencyDays: Number(
        rawCare.fertilizingFrequencyDays ??
          DEFAULT_CARE.fertilizingFrequencyDays,
      ),
      pruningFrequencyDays: Number(
        rawCare.pruningFrequencyDays ?? DEFAULT_CARE.pruningFrequencyDays,
      ),
      sunlight: (["sol", "sombra", "mixto"].includes(careSunlight)
        ? careSunlight
        : DEFAULT_CARE.sunlight) as "sol" | "sombra" | "mixto",
      careNotes: String(rawCare.careNotes ?? ""),
    },
  };
}
