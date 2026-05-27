import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = (userId: string) => `@app_streak_${userId}`;

type StreakData = { lastActiveDate: string; streak: number };

export async function updateAppStreak(userId: string): Promise<number> {
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  const raw  = await AsyncStorage.getItem(KEY(userId));
  const data: StreakData = raw ? JSON.parse(raw) : { lastActiveDate: '', streak: 0 };

  if (data.lastActiveDate === today) return data.streak;

  const newStreak = data.lastActiveDate === yesterday ? data.streak + 1 : 1;

  await AsyncStorage.setItem(KEY(userId), JSON.stringify({ lastActiveDate: today, streak: newStreak }));
  return newStreak;
}

export async function getAppStreak(userId: string): Promise<number> {
  const raw = await AsyncStorage.getItem(KEY(userId));
  if (!raw) return 0;
  const { lastActiveDate, streak }: StreakData = JSON.parse(raw);
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  return (lastActiveDate === today || lastActiveDate === yesterday) ? streak : 0;
}
