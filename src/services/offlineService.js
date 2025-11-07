// Offline Service - IndexedDB management for offline functionality
import { openDB } from 'idb';

const DB_NAME = 'DryBuildProDB';
const DB_VERSION = 1;

// Initialize IndexedDB
export const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Pending Actions Store
        if (!db.objectStoreNames.contains('pendingActions')) {
          const pendingStore = db.createObjectStore('pendingActions', {
            keyPath: 'id',
            autoIncrement: false,
          });
          pendingStore.createIndex('timestamp', 'timestamp');
          pendingStore.createIndex('status', 'status');
        }

        // Activities Store
        if (!db.objectStoreNames.contains('activities')) {
          const activitiesStore = db.createObjectStore('activities', {
            keyPath: 'id',
          });
          activitiesStore.createIndex('assigned_to', 'assigned_to');
          activitiesStore.createIndex('type', 'type');
        }

        // Defects Store
        if (!db.objectStoreNames.contains('defects')) {
          const defectsStore = db.createObjectStore('defects', {
            keyPath: 'id',
          });
          defectsStore.createIndex('status', 'status');
          defectsStore.createIndex('priority', 'priority');
        }

        // Materials Store
        if (!db.objectStoreNames.contains('materials')) {
          db.createObjectStore('materials', { keyPath: 'id' });
        }

        // Employees Store
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id' });
        }

        // Sites Store
        if (!db.objectStoreNames.contains('sites')) {
          db.createObjectStore('sites', { keyPath: 'id' });
        }

        // Photos Store (Base64 encoded for offline)
        if (!db.objectStoreNames.contains('photos')) {
          const photosStore = db.createObjectStore('photos', {
            keyPath: 'id',
          });
          photosStore.createIndex('activity_id', 'activity_id');
          photosStore.createIndex('defect_id', 'defect_id');
        }

        console.log('IndexedDB initialized successfully');
      },
    });
    return db;
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
    throw error;
  }
};

// ==========================================
// PENDING ACTIONS (for sync queue)
// ==========================================

export const addPendingAction = async (action) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const pendingAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...action,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
    };
    await db.add('pendingActions', pendingAction);
    console.log('Added pending action:', pendingAction.id);
    return pendingAction;
  } catch (error) {
    console.error('Error adding pending action:', error);
    throw error;
  }
};

export const getAllPendingActions = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    return await db.getAll('pendingActions');
  } catch (error) {
    console.error('Error getting pending actions:', error);
    return [];
  }
};

export const removePendingAction = async (actionId) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.delete('pendingActions', actionId);
    console.log('Removed pending action:', actionId);
  } catch (error) {
    console.error('Error removing pending action:', error);
  }
};

export const updatePendingActionStatus = async (actionId, status, error = null) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const action = await db.get('pendingActions', actionId);
    if (action) {
      action.status = status;
      action.retryCount = (action.retryCount || 0) + 1;
      action.lastAttempt = Date.now();
      if (error) action.error = error;
      await db.put('pendingActions', action);
    }
  } catch (error) {
    console.error('Error updating pending action:', error);
  }
};

// ==========================================
// ACTIVITIES
// ==========================================

export const saveActivitiesOffline = async (activities) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction('activities', 'readwrite');
    for (const activity of activities) {
      await tx.store.put(activity);
    }
    await tx.done;
    console.log(`Saved ${activities.length} activities offline`);
  } catch (error) {
    console.error('Error saving activities offline:', error);
  }
};

export const getActivitiesOffline = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    return await db.getAll('activities');
  } catch (error) {
    console.error('Error getting activities offline:', error);
    return [];
  }
};

export const saveActivityOffline = async (activity) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.put('activities', activity);
    console.log('Saved activity offline:', activity.id);
  } catch (error) {
    console.error('Error saving activity offline:', error);
  }
};

export const getActivityOffline = async (activityId) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    return await db.get('activities', activityId);
  } catch (error) {
    console.error('Error getting activity offline:', error);
    return null;
  }
};

// ==========================================
// DEFECTS
// ==========================================

export const saveDefectsOffline = async (defects) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction('defects', 'readwrite');
    for (const defect of defects) {
      await tx.store.put(defect);
    }
    await tx.done;
    console.log(`Saved ${defects.length} defects offline`);
  } catch (error) {
    console.error('Error saving defects offline:', error);
  }
};

export const getDefectsOffline = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    return await db.getAll('defects');
  } catch (error) {
    console.error('Error getting defects offline:', error);
    return [];
  }
};

export const saveDefectOffline = async (defect) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.put('defects', defect);
    console.log('Saved defect offline:', defect.id);
  } catch (error) {
    console.error('Error saving defect offline:', error);
  }
};

// ==========================================
// MATERIALS
// ==========================================

export const saveMaterialsOffline = async (materials) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction('materials', 'readwrite');
    for (const material of materials) {
      await tx.store.put(material);
    }
    await tx.done;
    console.log(`Saved ${materials.length} materials offline`);
  } catch (error) {
    console.error('Error saving materials offline:', error);
  }
};

export const getMaterialsOffline = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    return await db.getAll('materials');
  } catch (error) {
    console.error('Error getting materials offline:', error);
    return [];
  }
};

// ==========================================
// EMPLOYEES
// ==========================================

export const saveEmployeesOffline = async (employees) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction('employees', 'readwrite');
    for (const employee of employees) {
      await tx.store.put(employee);
    }
    await tx.done;
    console.log(`Saved ${employees.length} employees offline`);
  } catch (error) {
    console.error('Error saving employees offline:', error);
  }
};

export const getEmployeesOffline = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    return await db.getAll('employees');
  } catch (error) {
    console.error('Error getting employees offline:', error);
    return [];
  }
};

// ==========================================
// SITES
// ==========================================

export const saveSitesOffline = async (sites) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction('sites', 'readwrite');
    for (const site of sites) {
      await tx.store.put(site);
    }
    await tx.done;
    console.log(`Saved ${sites.length} sites offline`);
  } catch (error) {
    console.error('Error saving sites offline:', error);
  }
};

export const getSitesOffline = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    return await db.getAll('sites');
  } catch (error) {
    console.error('Error getting sites offline:', error);
    return [];
  }
};

// ==========================================
// PHOTOS (Base64 encoded)
// ==========================================

export const savePhotoOffline = async (photo) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.put('photos', {
      id: photo.id || `photo_${Date.now()}`,
      ...photo,
      savedAt: Date.now(),
    });
    console.log('Saved photo offline');
  } catch (error) {
    console.error('Error saving photo offline:', error);
  }
};

export const getPhotosOffline = async (activityId = null, defectId = null) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    if (activityId) {
      return await db.getAllFromIndex('photos', 'activity_id', activityId);
    } else if (defectId) {
      return await db.getAllFromIndex('photos', 'defect_id', defectId);
    } else {
      return await db.getAll('photos');
    }
  } catch (error) {
    console.error('Error getting photos offline:', error);
    return [];
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export const clearOfflineData = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const stores = [
      'activities',
      'defects',
      'materials',
      'employees',
      'sites',
      'photos',
      'pendingActions',
    ];

    for (const storeName of stores) {
      await db.clear(storeName);
    }

    console.log('Cleared all offline data');
  } catch (error) {
    console.error('Error clearing offline data:', error);
  }
};

export const getOfflineDataSize = async () => {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        usageInMB: (estimate.usage / (1024 * 1024)).toFixed(2),
        quotaInMB: (estimate.quota / (1024 * 1024)).toFixed(2),
        percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting storage estimate:', error);
    return null;
  }
};

// Check if we're online
export const isOnline = () => {
  return navigator.onLine;
};

// Sync all pending actions
export const syncAllPendingActions = async () => {
  const pendingActions = await getAllPendingActions();
  const results = {
    total: pendingActions.length,
    synced: 0,
    failed: 0,
    errors: [],
  };

  for (const action of pendingActions) {
    try {
      // Process the action (implementation depends on action type)
      // This would make API calls to sync the data
      console.log('Syncing action:', action.type);

      // If successful, remove from pending
      await removePendingAction(action.id);
      results.synced++;
    } catch (error) {
      console.error('Error syncing action:', action.id, error);
      await updatePendingActionStatus(action.id, 'failed', error.message);
      results.failed++;
      results.errors.push({
        actionId: action.id,
        error: error.message,
      });
    }
  }

  return results;
};

export default {
  initDB,
  addPendingAction,
  getAllPendingActions,
  removePendingAction,
  updatePendingActionStatus,
  saveActivitiesOffline,
  getActivitiesOffline,
  saveActivityOffline,
  getActivityOffline,
  saveDefectsOffline,
  getDefectsOffline,
  saveDefectOffline,
  saveMaterialsOffline,
  getMaterialsOffline,
  saveEmployeesOffline,
  getEmployeesOffline,
  saveSitesOffline,
  getSitesOffline,
  savePhotoOffline,
  getPhotosOffline,
  clearOfflineData,
  getOfflineDataSize,
  isOnline,
  syncAllPendingActions,
};
