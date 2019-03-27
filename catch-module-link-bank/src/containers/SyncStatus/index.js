import React from 'react';
import SyncStatus from './SyncStatus';
import StartSync from './StartSync';

const SyncBank = props => (
  <StartSync {...props}>
    {({ startSync, sync, loading, error }) => (
      <SyncStatus
        sync={sync}
        startSync={startSync}
        loading={loading}
        error={error}
        {...props}
      />
    )}
  </StartSync>
);

export default SyncBank;
