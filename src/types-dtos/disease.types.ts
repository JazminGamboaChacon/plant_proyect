export interface LocalDiagnosis {
  id: string;
  userId: string;
  photoUri: string;
  isHealthy: boolean;
  name: string;
  type: string;       // "enfermedad" | "plaga" | "deficiencia" | "otro"
  severity: string;   // "leve" | "moderado" | "grave"
  confidence: number; // 0-100
  affectedArea: string;
  description: string;
  treatment: string;
  product: string;
  createdAt: string;
}
