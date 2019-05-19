import { Platform } from 'react-native';
import dictionary from './dictionary';
const { colors, fonts } = dictionary;
const typography = {
  'H1/Desktop': {
    color: colors['ink'],
    fontSize: 40,
    letterSpacing: 0,
    lineHeight: 49.2,
    ...Platform.select({
      default: {
        fontFamily: fonts['700'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '700',
      },
    }),
  },
  'H1S/Desktop': {
    color: colors['ink'],
    fontSize: 40,
    letterSpacing: 0,
    lineHeight: 49.2,
    ...Platform.select({
      default: {
        fontFamily: fonts['700S'],
      },
      web: {
        fontFamily: fonts['serif'],
        fontWeight: '700',
      },
    }),
  },
  'H2/Desktop': {
    color: colors['ink'],
    fontSize: 32,
    letterSpacing: 0,
    lineHeight: 41.3,
    ...Platform.select({
      default: {
        fontFamily: fonts['700'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '700',
      },
    }),
  },
  'H2S/Desktop': {
    color: colors['ink'],
    fontSize: 32,
    letterSpacing: 0,
    lineHeight: 41.3,
    ...Platform.select({
      default: {
        fontFamily: fonts['700S'],
      },
      web: {
        fontFamily: fonts['serif'],
        fontWeight: '700',
      },
    }),
  },
  'H3/Desktop': {
    color: colors['ink'],
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 35.2,
    ...Platform.select({
      default: {
        fontFamily: fonts['700'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '700',
      },
    }),
  },
  'H3S/Desktop': {
    color: colors['ink'],
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 35.2,
    ...Platform.select({
      default: {
        fontFamily: fonts['700S'],
      },
      web: {
        fontFamily: fonts['serif'],
        fontWeight: '700',
      },
    }),
  },
  'H4/Desktop': {
    color: colors['ink'],
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 25.3,
    ...Platform.select({
      default: {
        fontFamily: fonts['700'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '700',
      },
    }),
  },
  'H4S/Desktop': {
    color: colors['ink'],
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 25.3,
    ...Platform.select({
      default: {
        fontFamily: fonts['700S'],
      },
      web: {
        fontFamily: fonts['serif'],
        fontWeight: '700',
      },
    }),
  },
  'H6/Desktop': {
    color: colors['ink'],
    fontSize: 11,
    letterSpacing: 0.8,
    lineHeight: 15,
    ...Platform.select({
      default: {
        fontFamily: fonts['400'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '400',
      },
    }),
  },
  'Body/Desktop': {
    color: colors['ink'],
    fontSize: 15,
    letterSpacing: 0,
    lineHeight: 22,
    ...Platform.select({
      default: {
        fontFamily: fonts['400'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '400',
      },
    }),
  },
  'FinePrint/Desktop': {
    color: colors['ink'],
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 19.8,
    ...Platform.select({
      default: {
        fontFamily: fonts['400'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '400',
      },
    }),
  },
  'FinePrintLink/Desktop': {
    color: colors['flare'],
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 19.8,
    ...Platform.select({
      default: {
        fontFamily: fonts['500'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '500',
      },
    }),
  },
  'FinePrintLight/Desktop': {
    color: colors['ink+1'],
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 19.8,
    ...Platform.select({
      default: {
        fontFamily: fonts['500'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '400',
      },
    }),
  },
  'FieldLabel/Desktop': {
    color: colors['ink'],
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 15.2,
    ...Platform.select({
      default: {
        fontFamily: fonts['500'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '500',
      },
    }),
  },
  'FieldLabel/Mobile': {
    color: colors['ink'],
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 16.4,
    ...Platform.select({
      default: {
        fontFamily: fonts['500'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '500',
      },
    }),
  },
  'BodyLink/Desktop': {
    color: colors['flare'],
    fontSize: 15,
    letterSpacing: 0,
    lineHeight: 22,
    ...Platform.select({
      default: {
        fontFamily: fonts['500'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '500',
      },
    }),
  },
  Rule: {
    borderBottomColor: colors['fog'],
    borderBottomWidth: 2,
    width: 302,
  },
  'H1/Mobile': {
    color: colors['ink'],
    fontSize: 36,
    letterSpacing: 0,
    lineHeight: 45,
    ...Platform.select({
      default: {
        fontFamily: fonts['700'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '700',
      },
    }),
  },
  'H1S/Mobile': {
    color: colors['ink'],
    fontSize: 36,
    letterSpacing: 0,
    lineHeight: 45,
    ...Platform.select({
      default: {
        fontFamily: fonts['700S'],
      },
      web: {
        fontFamily: fonts['serif'],
        fontWeight: '700',
      },
    }),
  },
  'H2/Mobile': {
    color: colors['ink'],
    fontSize: 28,
    letterSpacing: 0,
    lineHeight: 36,
    ...Platform.select({
      default: {
        fontFamily: fonts['700'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '700',
      },
    }),
  },
  'H2S/Mobile': {
    color: colors['ink'],
    fontSize: 28,
    letterSpacing: 0,
    lineHeight: 36,
    ...Platform.select({
      default: {
        fontFamily: fonts['700S'],
      },
      web: {
        fontFamily: fonts['serif'],
        fontWeight: '700',
      },
    }),
  },
  'H3/Mobile': {
    color: colors['ink'],
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 31,
    ...Platform.select({
      default: {
        fontFamily: fonts['700'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '700',
      },
    }),
  },
  'H3S/Mobile': {
    color: colors['ink'],
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 30,
    ...Platform.select({
      default: {
        fontFamily: fonts['700S'],
      },
      web: {
        fontFamily: fonts['serif'],
        fontWeight: '700',
      },
    }),
  },
  'H4/Mobile': {
    color: colors['ink'],
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 25.3,
    ...Platform.select({
      default: {
        fontFamily: fonts['700'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '700',
      },
    }),
  },
  'H4S/Mobile': {
    color: colors['ink'],
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 25.3,
    ...Platform.select({
      default: {
        fontFamily: fonts['700S'],
      },
      web: {
        fontFamily: fonts['serif'],
        fontWeight: '700',
      },
    }),
  },
  'H6/Mobile': {
    color: colors['ink'],
    fontSize: 12,
    letterSpacing: 0.7,
    lineHeight: 16,
    ...Platform.select({
      default: {
        fontFamily: fonts['400'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '400',
      },
    }),
  },
  'Body/Mobile': {
    color: colors['ink'],
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 23.4,
    ...Platform.select({
      default: {
        fontFamily: fonts['400'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '400',
      },
    }),
  },
  'FinePrint/Mobile': {
    color: colors['ink'],
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 21.3,
    ...Platform.select({
      default: {
        fontFamily: fonts['400'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '400',
      },
    }),
  },
  'FinePrintLight/Mobile': {
    color: colors['ink+1'],
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 21.3,
    ...Platform.select({
      default: {
        fontFamily: fonts['500'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '400',
      },
    }),
  },
  'FinePrintLink/Mobile': {
    color: colors['flare'],
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 21.3,
    ...Platform.select({
      default: {
        fontFamily: fonts['500'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '500',
      },
    }),
  },
  'BodyLink/Mobile': {
    color: colors['flare'],
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 23.4,
    ...Platform.select({
      default: {
        fontFamily: fonts['500'],
      },
      web: {
        fontFamily: fonts['primary'],
        fontWeight: '500',
      },
    }),
  },
  Regular: Platform.select({
    default: {
      fontFamily: fonts['400'],
    },
    web: {
      fontWeight: '400',
    },
  }),
  Bold: Platform.select({
    default: {
      fontFamily: fonts['700'],
    },
    web: {
      fontWeight: '700',
    },
  }),
  Medium: Platform.select({
    default: {
      fontFamily: fonts['500'],
    },
    web: {
      fontWeight: '500',
    },
  }),
  Success: {
    color: colors['algae-1'],
  },
  Warning: {
    color: colors['coral-2'],
  },
};

if (Platform.OS !== 'web') {
  for (const key in typography) {
    if (/\//.test(key)) {
      typography[key] = Object.assign({}, typography[key], {
        fontSize: typography[key].fontSize + 2,
      });
    }
  }
}

export default typography;
