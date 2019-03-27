import { createSelector } from 'reselect';
import { createLocalSelector } from '@catch/utils';
import { NAME } from './duck';

const selector = createLocalSelector(NAME);

// ---------------
// Input Selectors
// ---------------
export const getIsPasswordChanging = selector('isPasswordChanging');
export const getIsEmailChanging = selector('isEmailChanging');
export const getIsRequestingCode = selector('isRequestingCode');
export const getIsCodeSubmitting = selector('isCodeSubmitting');
export const getEmailModalVisible = selector('emailModalVisible');
export const getNewEmailAddress = selector('newEmailAddress');
