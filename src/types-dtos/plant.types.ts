export interface PlantCare {
  waterFreqDays: number;
  lastWatered: string | null;
  fertilizeFreqDays: number;
  lastFertilized: string | null;
  pruneFreqDays: number;
  lastPruned: string | null;
  lightType: 'sol' | 'sombra' | 'mixto';
  careNotes: string;
}

export type CareType = 'riego' | 'abono' | 'poda';

export interface CareHistoryEntry {
  id: string;
  userId: string;
  plantId: string;
  plantName: string;
  careType: CareType;
  doneAt: string;
  lunarPhase: string;
  triggeredBy: 'manual' | 'shake' | 'notification';
}

export interface LocalPlant {
  localId: string;
  serverId: string | null;
  userId: string;
  commonName: string;
  scientificName: string;
  localPhotoUri: string;
  photoURL: string | null;
  type: string;
  groupId: string;
  isFavorite: boolean;
  notes: string;
  confidence: number;
  family: string;
  description: string;
  toxicity: string;
  watering: string;
  sunlight: string;
  soil: string;
  createdAt: string;
  synced: boolean;
  syncError: string | null;
  care?: PlantCare;
}

export type LocalPlantDraft = Omit<LocalPlant, 'localId' | 'serverId' | 'synced' | 'syncError'>;
