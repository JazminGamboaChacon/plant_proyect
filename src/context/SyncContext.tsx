import NetInfo from '@react-native-community/netinfo';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { usePlantStorage } from '../hooks/usePlantStorage';

type SyncContextType = {
  pendingCount: number;
  isSyncing: boolean;
  syncNow: () => Promise<void>;
  lastSyncError: string | null;
};

const SyncContext = createContext<SyncContextType | null>(null);

export function SyncProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string;
}) {
  const { pendingCount, isSyncing, syncNow, lastSyncError } =
    usePlantStorage(userId);

  const handleNetworkChange = useCallback(
    (state: { isConnected: boolean | null; isInternetReachable: boolean | null }) => {
      if (state.isConnected && state.isInternetReachable && pendingCount > 0 && !isSyncing) {
        syncNow();
      }
    },
    [pendingCount, isSyncing, syncNow]
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);
    return unsubscribe;
  }, [handleNetworkChange]);

  return (
    <SyncContext.Provider value={{ pendingCount, isSyncing, syncNow, lastSyncError }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync(): SyncContextType {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used within SyncProvider');
  return ctx;
}
