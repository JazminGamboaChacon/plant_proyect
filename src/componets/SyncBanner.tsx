import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSync } from '../context/SyncContext';

export default function SyncBanner() {
  const { pendingCount, isSyncing, syncNow, lastSyncError } = useSync();
  const { theme } = useTheme();
  const t = theme.colors;

  if (pendingCount === 0) return null;

  return (
    <View style={[styles.banner, { backgroundColor: t.peach }]}>
      <View style={styles.row}>
        {isSyncing ? (
          <ActivityIndicator size="small" color={t.textPrimary} />
        ) : (
          <Feather name="cloud-off" size={15} color={t.textPrimary} />
        )}
        <Text style={[styles.text, { color: t.textPrimary }]}>
          {isSyncing
            ? 'Sincronizando…'
            : `${pendingCount} planta${pendingCount > 1 ? 's' : ''} pendiente${pendingCount > 1 ? 's' : ''} de sincronizar`}
        </Text>
        {!isSyncing && (
          <TouchableOpacity onPress={syncNow} style={styles.refreshBtn}>
            <Feather name="refresh-cw" size={15} color={t.primary} />
          </TouchableOpacity>
        )}
      </View>
      {lastSyncError && (
        <Text style={[styles.errorText, { color: t.error }]}>{lastSyncError}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  refreshBtn: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 23,
  },
});
