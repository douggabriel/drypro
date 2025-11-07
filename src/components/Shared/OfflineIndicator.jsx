import React from 'react';
import { WifiOff, Loader, Check, AlertCircle } from 'lucide-react';
import { useOffline } from '../../contexts/OfflineContext';

const OfflineIndicator = () => {
  const { isOnline, syncStatus, getPendingCount, getFailedCount, handleSync } = useOffline();

  // Don't show anything if online and no pending actions
  if (isOnline && syncStatus === 'synced' && getPendingCount() === 0) {
    return null;
  }

  // Offline banner
  if (!isOnline) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-yellow-500 text-white px-4 py-3 shadow-lg animate-slide-down lg:left-64">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <WifiOff className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium flex-1">
            You're offline. Changes will sync automatically when reconnected.
          </span>
          {getPendingCount() > 0 && (
            <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm font-bold">
              {getPendingCount()} pending
            </span>
          )}
        </div>
      </div>
    );
  }

  // Syncing status
  if (syncStatus === 'syncing') {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-blue-500 text-white px-4 py-3 shadow-lg animate-slide-down lg:left-64">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Loader className="w-5 h-5 animate-spin flex-shrink-0" />
          <span className="font-medium flex-1">
            Syncing {getPendingCount()} change{getPendingCount() !== 1 ? 's' : ''}...
          </span>
        </div>
      </div>
    );
  }

  // Sync failed
  if (syncStatus === 'failed') {
    const failedCount = getFailedCount();
    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-red-500 text-white px-4 py-3 shadow-lg animate-slide-down lg:left-64">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium flex-1">
            Failed to sync {failedCount} item{failedCount !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleSync}
            className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OfflineIndicator;
