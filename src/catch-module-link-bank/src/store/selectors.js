// import { createSelector } from 'reselect';
import { createLocalSelector } from '@catch/utils';
import { NAME } from './duck';

// selectorCreator that creates convenience selectors that target this module.
const selector = createLocalSelector(NAME);

// ---------------
// Input Selectors
// ---------------
export const getBank = selector('selectedBank');
export const getBankLinkId = selector('bankLinkId');
export const getChallengeType = selector('challengeType');
export const getStage = selector('stage');
export const getIsLinking = selector('isLinking');
export const getNextPath = selector('nextPath');
export const getIsSelecting = selector('isSelecting');
// -----------------
// Complex Selectors
// -----------------
