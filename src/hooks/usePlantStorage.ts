import { useCallback, useEffect, useState } from 'react';
import { LocalPlant, LocalPlantDraft } from '../types-dtos/plant.types';
import {
  addPlant,
  loadPlants,
  persistPhoto,
} from '../services/plantStorageService';
import { syncPendingPlants } from '../services/syncService';

export interface UsePlantStorageReturn {
  plants: LocalPlant[];
  pendingCount: number;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncError: string | null;
  savePlant: (
    draft: Omit<LocalPlantDraft, 'localPhotoUri'>,
    tempPhotoUri: string
  ) => Promise<LocalPlant>;
  syncNow: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePlantStorage(userId: string): UsePlantStorageReturn {
  const [plants, setPlants] = useState<LocalPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const data = await loadPlants();
    setPlants(data);
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refresh();
      setIsLoading(false);
    })();
  }, [refresh]);

  const savePlant = useCallback(
    async (
      draft: Omit<LocalPlantDraft, 'localPhotoUri'>,
      tempPhotoUri: string
    ): Promise<LocalPlant> => {
      const localPhotoUri = await persistPhoto(tempPhotoUri);
      const plant = await addPlant({ ...draft, localPhotoUri });
      await refresh();
      return plant;
    },
    [refresh]
  );

  const syncNow = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setLastSyncError(null);
    try {
      const { failed } = await syncPendingPlants(userId);
      if (failed > 0) {
        setLastSyncError(
          `${failed} planta${failed > 1 ? 's' : ''} no se pudo sincronizar`
        );
      }
    } catch (err) {
      setLastSyncError(err instanceof Error ? err.message : 'Error de sincronización');
    } finally {
      await refresh();
      setIsSyncing(false);
    }
  }, [isSyncing, userId, refresh]);

  const pendingCount = plants.filter((p) => !p.synced).length;

  return {
    plants,
    pendingCount,
    isLoading,
    isSyncing,
    lastSyncError,
    savePlant,
    syncNow,
    refresh,
  };
}
