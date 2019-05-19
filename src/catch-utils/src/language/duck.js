const DEFAULT_LOCALE = 'en';

function action(type, payload = {}) {
  return { type, ...payload };
}

// Constants
export const NAME = 'language';
export const CHANGE_LOCALE = `covered/${NAME}/CHANGE_LOCALE`;

export const constants = {
  NAME,
  CHANGE_LOCALE,
};

// Actions
export const actions = {
  changeLocale: locale => action(CHANGE_LOCALE, { locale }),
};

const defaultState = {
  locale: DEFAULT_LOCALE,
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return { ...state, locale: action.locale };
    default:
      return state;
  }
}
