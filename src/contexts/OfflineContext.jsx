import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  initDB,
  addPendingAction,
  getAllPendingActions,
  removePendingAction,
  syncAllPendingActions,
  getOfflineDataSize,
  isOnline as checkOnline,
} from '../services/offlineService';

export const OfflineContext = createContext({});

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState([]);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'syncing', 'synced', 'failed'
  const [storageInfo, setStorageInfo] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize IndexedDB on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        setDbInitialized(true);
        console.log('OfflineContext: IndexedDB initialized');

        // Load pending actions
        const actions = await getAllPendingActions();
        setPendingActions(actions);

        // Get storage info
        const storage = await getOfflineDataSize();
        setStorageInfo(storage);
      } catch (error) {
        console.error('OfflineContext: Error initializing:', error);
      }
    };

    initialize();
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('OfflineContext: Going online');
      setIsOnline(true);

      // Trigger sync when coming back online
      if (pendingActions.length > 0) {
        handleSync();
      }
    };

    const handleOffline = () => {
      console.log('OfflineContext: Going offline');
      setIsOnline(false);
      setSyncStatus('synced'); // Reset sync status when offline
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingActions]);

  // Queue an action for later sync
  const queueAction = async (action) => {
    try {
      const pendingAction = await addPendingAction(action);
      setPendingActions((prev) => [...prev, pendingAction]);
      console.log('OfflineContext: Action queued:', action.type);
      return pendingAction;
    } catch (error) {
      console.error('OfflineContext: Error queuing action:', error);
      throw error;
    }
  };

  // Sync all pending actions
  const handleSync = async () => {
    if (!checkOnline()) {
      console.log('OfflineContext: Cannot sync - offline');
      return { success: false, error: 'Offline' };
    }

    if (pendingActions.length === 0) {
      console.log('OfflineContext: No pending actions to sync');
      return { success: true, synced: 0 };
    }

    try {
      setSyncStatus('syncing');
      console.log('OfflineContext: Starting sync...');

      const results = await syncAllPendingActions();

      // Refresh pending actions list
      const remainingActions = await getAllPendingActions();
      setPendingActions(remainingActions);

      if (results.failed === 0) {
        setSyncStatus('synced');
        console.log('OfflineContext: Sync completed successfully');
      } else {
        setSyncStatus('failed');
        console.log('OfflineContext: Some actions failed to sync');
      }

      // Update storage info
      const storage = await getOfflineDataSize();
      setStorageInfo(storage);

      return { success: true, ...results };
    } catch (error) {
      console.error('OfflineContext: Error during sync:', error);
      setSyncStatus('failed');
      return { success: false, error: error.message };
    }
  };

  // Remove a specific pending action
  const removeAction = async (actionId) => {
    try {
      await removePendingAction(actionId);
      setPendingActions((prev) => prev.filter((a) => a.id !== actionId));
      console.log('OfflineContext: Action removed:', actionId);
    } catch (error) {
      console.error('OfflineContext: Error removing action:', error);
    }
  };

  // Refresh storage info
  const refreshStorageInfo = async () => {
    try {
      const storage = await getOfflineDataSize();
      setStorageInfo(storage);
      return storage;
    } catch (error) {
      console.error('OfflineContext: Error refreshing storage info:', error);
      return null;
    }
  };

  // Get count of pending actions
  const getPendingCount = () => pendingActions.length;

  // Get count of failed actions
  const getFailedCount = () => {
    return pendingActions.filter((a) => a.status === 'failed').length;
  };

  const value = {
    isOnline,
    pendingActions,
    syncStatus,
    storageInfo,
    dbInitialized,
    queueAction,
    handleSync,
    removeAction,
    refreshStorageInfo,
    getPendingCount,
    getFailedCount,
  };

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
};

// Custom hook to use offline context
export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
};

export default OfflineProvider;
