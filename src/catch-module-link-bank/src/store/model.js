/* @flow */

// Types
export type SyncStatus = {
  id: string,
  syncStatus: string,
  syncProgressMessage: string,
  percentComplete: number,
};

// Utility
export function isAlreadyLinked(errorMessage: string): boolean {
  return /already exists with credentials/.test(errorMessage);
}

export function isLoginError(status: string): boolean {
  return status === 'LOGIN_ERROR';
}

const STATUSES = ['SYSTEM_ERROR', 'LOGIN_ERROR', 'NO_ACCOUNTS_ERROR'];

export function shouldTryAgain(status) {
  return STATUSES.includes(status);
}
