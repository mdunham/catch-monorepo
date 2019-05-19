import { createSelector } from 'reselect';
import { NAME } from './duck';

function createLocalSelector(namespace) {
  return function selector(key) {
    return state => state[namespace][key];
  };
}

const selector = createLocalSelector(NAME);

export const getGuideProgressMenu = selector('progressMenu');
export const getGuideInfoModal = selector('infoModal');
export const getUpdates = selector('updates');
export const getUpdateIndex = selector('updateIndex');
