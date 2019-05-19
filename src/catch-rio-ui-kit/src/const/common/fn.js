import { darken, lighten, transparentize } from 'polished';

const colorOffsetHover = 0.05;
const colorOffsetFocus = 0.4;
const colorOffsetFaded = 0.2;
const colorOffsetDisabled = 0.1;
const opacityOffset = 0.5;

export const colorOffsets = {
  colorOffsetHover,
  colorOffsetFocus,
  colorOffsetFaded,
  colorOffsetDisabled,
};

export function makeHoverVariant(color) {
  return darken(colorOffsetHover, color);
}

export function makeDisabledVariant(color) {
  return transparentize(opacityOffset, color);
}

export function makeColorVariants({ primary, secondary, emphasis, subtle }) {
  return {
    primary,
    primaryHover: darken(colorOffsetHover, primary),
    primaryFocus: darken(colorOffsetFocus, primary),
    primaryFaded: lighten(colorOffsetFaded, primary),
    primaryDisabled: lighten(colorOffsetDisabled, primary),

    secondary,
    secondaryHover: darken(colorOffsetHover, secondary),
    secondaryFocus: darken(colorOffsetFocus, secondary),
    secondaryFaded: lighten(colorOffsetFaded, secondary),
    secondaryDisabled: lighten(colorOffsetDisabled, secondary),

    emphasis,
    emphasisHover: darken(colorOffsetHover, emphasis),
    emphasisFocus: darken(colorOffsetFocus, emphasis),
    emphasisFaded: lighten(colorOffsetFaded, emphasis),
    emphasisDisabled: lighten(colorOffsetDisabled, emphasis),

    subtle,
    subtleHover: darken(colorOffsetHover, subtle),
    subtleFocus: darken(colorOffsetFocus, subtle),
    subtleFaded: lighten(colorOffsetFaded, subtle),
    subtleDisabled: lighten(colorOffsetDisabled, subtle),
  };
}

export default {
  colorOffsets,
  makeColorVariants,
  makeHoverVariant,
  makeDisabledVariant,
};
