import { NAME } from './duck';

function createLocalSelector(namespace) {
  return function selector(key) {
    return state => state[namespace][key];
  };
}

const selector = createLocalSelector(NAME);

export const getLocale = selector('locale');
