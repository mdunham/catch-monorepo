import { fn, base, animations as anim } from './common';
import { pru, rio, desktop } from './themes';
import dictionary from '../styles/dictionary';

const activeTheme = rio;

const variants = fn.makeColorVariants(activeTheme.colors.base);

export const colors = {
  ...dictionary.colors,
  ...variants,
  ...activeTheme.colors.gray,
  ...activeTheme.colors.blue,
  ...activeTheme.colors.green,
  ...activeTheme.colors.red,
  ...activeTheme.colors.orange,
  ...activeTheme.colors.yellow,
  ...activeTheme.elementColors.state,
  ...activeTheme.elementColors.overlay,
  ...activeTheme.elementColors.elements,
  ...fn.colorOffsets,
  ...activeTheme.colors.overlay,
};

export const fontColors = {
  primary: colors.ink,
  error: colors['coral-1'],
  link: colors.flare,
  subtle: colors['ink+1'],
  white: colors['snow'],
  black: colors['ink'],
};
export const fonts = activeTheme.fonts;
export const borderRadius = activeTheme.borderRadius;
export const shadow = activeTheme.shadow;
export const size = activeTheme.size;

// Shared
export const zIndexLevels = base.zIndexLevels;
export const zIndex = base.zIndex;

export const transitions = base.transitions;
export const vendorColors = base.vendorColors;
export const bankColorNames = base.bankColorNames;
export const media = base.media;

export const navigationOptions = {
  headerStyle: {
    backgroundColor: '#F9FAFB',
    zIndex: 100,
    borderBottomWidth: 0,
  },
  headerBackTitleStyle: {
    fontFamily: 'ttnorms-regular',
  },
  headerTintColor: colors.primary,
};

// The space array is used to determine the distance between elements throughout
// the app.  They are accessed via array indexes. space[0] === 0 px.
//
// For example, in our Flex component we could say mb={3} which would evaluate
// to marginBottom: 24px
export const space = activeTheme.space;
export const padding = activeTheme.padding;
export const animations = anim;
export const makeHoverVariant = fn.makeHoverVariant;
export const makeDisabledVariant = fn.makeDisabledVariant;

// Final theme object composed of all the styling variables
export const theme = {
  colors,
  fontColors,
  fonts,
  media,
  shadow,
  space,
  size,
  padding,
  zIndex,
  borderRadius,
  animations,
  transitions,
  vendorColors,
  makeHoverVariant,
  navigationOptions,
};
