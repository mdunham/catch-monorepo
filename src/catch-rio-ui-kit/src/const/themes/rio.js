import { Platform, Dimensions } from 'react-native';

// This should give us an initial idea if the user
// loaded the app on a mobile device so we can scale up the
// font sizes if necessary
const width = Dimensions.get('window').width;
const isMobile = width < 400;

const NATIVE_OFFSET = 2;
const WEB_OFFSET = isMobile ? 1 : 0;

// @NOTE: => https://www.figma.com/file/7kmay0cyzjoP0qopQxKHFA/UI-Library?node-id=494%3A0
export const colors = {
  base: {
    primary: '#5683FF',
    secondary: '#2AAD86',
    emphasis: '#FF605B',
    subtle: '#B1B4BD',
  },
  gray: {
    gray1: '#3B4459',
    gray2: '#62697A',
    gray3: '#B1B7C4',
    gray4: '#CBCED9',
    gray5: '#F0F1F2',
    gray6: '#F8F9FA',
    grayN: '#B1B4BD',
    white: '#fff',
    black: '#000',
    ash: '#777E8C',
    charcoal: '#3B4459',
    'charcoal--dark1': '#1F2533',
    'charcoal--light1': '#62697A',
    'charcoal--light2': '#898F9B',
    'charcoal--light3': '#B1B4BD',
    'charcoal--light4': '#D7D9DE',
    'charcoal--light5': '#EBECEE',
    'charcoal--light6': '#F9FAFB',
    fog: '#D7D9DE',
    ghost: '#F9FAFB',
    mist: '#EBECEE',
    smoke: '#B1B4BD',
  },
  blue: {
    ozone: '#E8EEFF',
    wave: '#5683FF',
    'wave--dark1': '#4569CC',
    'wave--light1': '#789CFF',
    'wave--light2': '#BBCEFF',
    'wave--light3': '#EBF0FF',
  },
  green: {
    grass: '#37E1AF',
    mint: '#86ECCE',
    moss: '#13BF94',
    'moss--dark1': '#2AA984',
    'moss--light1': '#37E1AF',
    'moss--light2': '#86ECCE',
    'moss--light3': '#EBFCF7',
  },
  red: {
    coral: '#FE7F7B',
    'coral--dark1': '#CC4E49',
    'coral--light1': '#FE7F7B',
    'coral--light2': '#FEBEBC',
    'coral--light3': '#FEEEED',
    fire: '#FF605B',
  },
  orange: {
    'honey--dark1': '#EBA226',
    honey: '#FFB638',
  },
  yellow: {
    rays: '#F3E566',
  },
};

export const elementColors = {
  state: {
    error: '#FF605B',
    warning: '#FFB73B',
    success: '#37E1AF',
    debit: '#13BF94',
    credit: '#FF605B',
  },
  overlay: {
    overlay: 'rgba(92, 95, 107, 0.6)',
  },
  elements: {
    navbar: colors.gray.white,
    navbarInvert: false,
    navbarLinkActive: '#3B4459',
  },
};

export const fontColors = {
  primary: colors.gray.charcoal,
  emphasis: colors.base.emphasis,
  secondary: elementColors.state.debit,
  error: elementColors.state.error,
  link: colors.base.primary,
  subtle: colors.gray.gray2,
  white: colors.gray.white,
  black: colors.gray.black,
  ash: colors.gray.ash,
  smoke: colors.gray.smoke,
};

export const fonts = {
  // Kinds
  primary: Platform.select({
    web: `'TT Norms', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif`,
    default: {
      semibold: 'TTNorms-Semibold',
      bold: 'TTNorms-Bold',
      boldItalic: 'TTNorms-BoldItalic',
      italic: 'TTNorms-Italic',
      light: 'TTNorms-Light',
      lightItalic: 'TTNorms-LightItalic',
      medium: 'TTNorms-Medium',
      mediumItalic: 'TTNorms-MediumItalic',
      normal: 'TTNorms-Regular',
    },
  }),
  signature: Platform.select({
    web: `'Learning Curve', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif`,
    android: {
      bold: 'LearningCurve-Bold',
      normal: 'LearningCurve-Regular',
    },
    ios: 'Learning Curve',
  }),
  // Weights
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',

  // Header sizes
  h1: 40,
  h2: 28,
  h3: 20,
  h4: 18,
  h5: 18,
  h6: 18,
  p: 15,

  // Other sizes
  ...Platform.select({
    web: {
      tiny: 11,
      small: 13,
      body: 15 + WEB_OFFSET,
      nav: 17,
      large: 18,
      extraLarge: 20,
      largest: 32,
    },
    default: {
      tiny: 11 + NATIVE_OFFSET,
      small: 13 + NATIVE_OFFSET,
      body: 15 + NATIVE_OFFSET,
      nav: 17 + NATIVE_OFFSET,
      large: 18 + NATIVE_OFFSET,
      extraLarge: 20 + NATIVE_OFFSET,
      largest: 32 + NATIVE_OFFSET,
    },
  }),
};

export const shadow = {
  button: '0px 6px 14px rgba(50, 50, 93, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.05)',
  minor: {
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 4,
  },
  card: Platform.select({
    web: {
      shadowOpacity: 0.03,
      shadowOffset: { width: 2, height: 2 },
      shadowRadius: 6,
    },
    ios: {
      shadowOpacity: 0.1,
      shadowOffset: { width: 2, height: 2 },
      shadowRadius: 3,
    },
    android: {
      elevation: 1,
    },
  }),
  deep: Platform.select({
    web: {
      shadowOpacity: 0.06,
      shadowOffset: { width: 1, height: 5 },
      shadowRadius: 18,
    },
    ios: {
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 20 },
      shadowRadius: 10,
    },
    android: {
      elevation: 2,
    },
  }),
  sliderHandle: {
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  backButton: {
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 4,
  },
};

export const borderRadius = {
  small: 4,
  regular: 6,
  large: 8,
};

export const space = [0, 8, 16, 24, 36, 54];

export const size = {
  pageMaxWidth: 1076,
  navbarHeight: 64,
};

export const padding = {
  x: [2, 2, 4],
  y: [2, 2, 4],
};

export default {
  colors,
  elementColors,
  fontColors,
  fonts,
  shadow,
  borderRadius,
  padding,
  space,
  size,
};
