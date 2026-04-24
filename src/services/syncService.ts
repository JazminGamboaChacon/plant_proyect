import { createPlant } from './api';
import { getPendingPlants, markSynced, markSyncError } from './plantStorageService';

export async function syncPendingPlants(
  userId: string
): Promise<{ synced: number; failed: number }> {
  const pending = await getPendingPlants();
  let synced = 0;
  let failed = 0;

  for (const plant of pending) {
    try {
      const apiPlant = await createPlant({
        userId,
        commonName: plant.commonName,
        scientificName: plant.scientificName,
        photoURL: plant.photoURL,
        type: plant.type || 'unknown',
        groupId: plant.groupId || '',
        isFavorite: plant.isFavorite,
        notes: plant.notes,
      });
      await markSynced(plant.localId, apiPlant.id);
      synced++;
    } catch (err) {
      await markSyncError(
        plant.localId,
        err instanceof Error ? err.message : 'Error de sincronización'
      );
      failed++;
    }
  }

  return { synced, failed };
}
