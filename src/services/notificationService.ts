import * as Notifications from 'expo-notifications';
import { LocalPlant, CareType } from '../types-dtos/plant.types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

const CARE_LABELS: Record<CareType, string> = {
  riego: 'regar',
  abono: 'abonar',
  poda: 'podar',
};

export async function scheduleCareReminder(
  plant: LocalPlant,
  careType: CareType,
  dueDate: Date,
): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: plant.commonName,
        body: `Hoy toca ${CARE_LABELS[careType]} tu planta.`,
        data: { plantLocalId: plant.localId, careType },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dueDate,
      },
    });
    return id;
  } catch {
    return null;
  }
}

export async function cancelPlantNotifications(localId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if ((n.content.data as { plantLocalId?: string })?.plantLocalId === localId) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}
