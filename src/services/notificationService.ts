import { LocalPlant, CareType } from '../types-dtos/plant.types';

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function scheduleCareReminder(
  _plant: LocalPlant,
  _careType: CareType,
  _dueDate: Date,
): Promise<string | null> {
  return null;
}

export async function cancelPlantNotifications(_localId: string): Promise<void> {}
