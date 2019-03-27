import { addLocaleData } from 'react-intl';

// Browser required data that needs to get loaded for each language we choose to support
import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
// Required for working with React native
// TODO: figure out dynamic import so it doesn't get in the
// webpack bundle
import 'intl';
import 'intl/locale-data/jsonp/en.js';

// Our translations
import enTranslationMessages from './translations/en.json';
import frTranslationMessages from './translations/fr.json';
import disclosureMessages from './translations/disclosures.json';
import portfolioMessages from './translations/portfolios.json';

// Add language data we care about
addLocaleData([...enLocaleData, ...frLocaleData]);

export const DEFAULT_LOCALE = 'en';

// This is copy that deserves special treatment i.e. disclosures
const specialLanguage = {
  ...disclosureMessages,
  ...portfolioMessages,
};

/**
 * @param {string} locale the locale messages should be formated for
 * @param {Object} messages the messages to format
 * @param {Object} fallback any language we cover fully that we can
 * fall back on if we are missing some, should avoid usage
 * @param {Object} special included copy no matter the locale
 */
export const formatTranslationMessages = (
  locale,
  messages,
  fallback,
  special = {},
) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, fallback)
      : {};
  const mainMessages = Object.keys(messages).reduce(
    (formattedMessages, key) => {
      const formattedMessage =
        !messages[key] && locale !== DEFAULT_LOCALE
          ? defaultFormattedMessages[key]
          : messages[key];
      return Object.assign(formattedMessages, { [key]: formattedMessage });
    },
    {},
  );
  return {
    ...mainMessages,
    ...special,
  };
};

export const translationMessages = {
  en: formatTranslationMessages(
    'en',
    enTranslationMessages,
    {},
    specialLanguage,
  ),
  fr: formatTranslationMessages(
    'fr',
    frTranslationMessages,
    enTranslationMessages,
    specialLanguage,
  ),
};

export const SUPPORTED_LOCALES = Object.keys(translationMessages);
