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
  watering: string;
  sunlight: string;
  soil: string;
  createdAt: string;
  synced: boolean;
  syncError: string | null;
}

export type LocalPlantDraft = Omit<LocalPlant, 'localId' | 'serverId' | 'synced' | 'syncError'>;
