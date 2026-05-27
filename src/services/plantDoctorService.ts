import * as FileSystem from 'expo-file-system/legacy';

export interface DiagnosisResult {
  isHealthy: boolean;
  name: string;
  type: string;
  severity: string;
  confidence: number;
  affectedArea: string;
  description: string;
  treatment: string;
  product: string;
}

const PROMPT =
  'Analiza la imagen de una planta y diagnostica su estado de salud.\n' +
  'Responde ÚNICAMENTE con un JSON válido, sin texto extra, sin backticks, sin explicaciones.\n\n' +
  'Si la planta se ve saludable responde:\n{ "isHealthy": true }\n\n' +
  'Si detectas algún problema responde con este formato exacto:\n' +
  '{\n' +
  '  "isHealthy": false,\n' +
  '  "name": "nombre del problema en español (ej: Oídio, Araña roja, Clorosis por hierro)",\n' +
  '  "type": "enfermedad" | "plaga" | "deficiencia" | "otro",\n' +
  '  "severity": "leve" | "moderado" | "grave",\n' +
  '  "confidence": número entre 0 y 1,\n' +
  '  "affectedArea": "descripción breve de la zona afectada en español",\n' +
  '  "description": "descripción del problema en español, 2-3 oraciones",\n' +
  '  "treatment": "tratamiento recomendado en español, 2-3 oraciones",\n' +
  '  "product": "nombre de uno o dos productos agroquímicos comerciales específicos recomendados (fungicida, insecticida, fertilizante, etc.) con su ingrediente activo entre paréntesis, en español"\n' +
  '}';

export async function diagnosePlant(
  photoUri: string,
  preloadedBase64?: string,
): Promise<DiagnosisResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_ID_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_GEMINI_ID_KEY no está configurada en .env');

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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: PROMPT },
            { inlineData: { mimeType: 'image/jpeg', data: base64 } },
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
  const rawText: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No se pudo interpretar la respuesta. Intenta con otra foto.');
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      throw new Error('No se pudo interpretar la respuesta. Intenta con otra foto.');
    }
  }

  if (parsed.isHealthy) {
    return {
      isHealthy: true,
      name: '',
      type: '',
      severity: '',
      confidence: 100,
      affectedArea: '',
      description: '',
      treatment: '',
      product: '',
    };
  }

  return {
    isHealthy: false,
    name: String(parsed.name ?? 'Problema desconocido'),
    type: String(parsed.type ?? 'otro'),
    severity: String(parsed.severity ?? 'leve'),
    confidence: Math.round(Number(parsed.confidence ?? 0) * 100),
    affectedArea: String(parsed.affectedArea ?? ''),
    description: String(parsed.description ?? ''),
    treatment: String(parsed.treatment ?? ''),
    product: String(parsed.product ?? ''),
  };
}
