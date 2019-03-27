export const fadeInSlowRight = {
  from: {
    opacity: 0,
    transform: 'translate3d(30%, 0, 0)',
    width: 16,
    height: 16,
  },
  to: {
    opacity: 1,
    transform: 'none',
    width: 20,
    height: 20,
  },
};

export const inAndUp = {
  animationDuration: '.3s',
  animationTimingFunction: 'bezier(.17,.67,.83,1)',
  animationName: [
    {
      from: {
        transform: [{ scale: '.97', translateY: 16 }],
        visibility: 'visible',
        opacity: 0,
      },
      to: {
        transform: [{ scale: '1', translateY: 0 }],
        opacity: 1,
      },
    },
  ],
};

export const fadeInSlowLeft = {
  from: {
    opacity: 0,
    transform: 'translate3d(-10%, 0, 0)',
  },
  to: {
    opacity: 1,
    transform: 'none',
  },
};

export const fadeInDown = {
  animationDuration: '.4s',
  animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
  animationName: [
    {
      from: {
        transform: 'translateY(-60px)',
        opacity: 0,
      },
      to: {
        transform: 'translate(0)',
        opacity: 1,
      },
    },
  ],
};

// TODO: figure out why animations break tests
export const fadeInUp = {
  animationDuration: '.5s',
  animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
  animationName: [
    {
      '0%': {
        transform: [{ translateZ: 0 }, { scale: 0.99 }, { translateY: 8 }],
        opacity: 0,
      },
      '100%': {
        transform: [{ translate: 0 }],
        opacity: 1,
      },
    },
  ],
};

export const fadeInNext = {
  animationDuration: '.5s',
  animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
  animationName: [
    {
      from: {
        transform: 'translateX(16px)',
        opacity: 0,
      },
      to: {
        transform: 'translate(0)',
        opacity: 1,
      },
    },
  ],
};

export const fade = {
  animationDuration: '.75s',
  animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  animationName: [
    {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    },
  ],
};

export const fadeInUpNoBounce = {
  animationDuration: '.4s',
  animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
  animationName: [
    {
      from: {
        transform: 'translateY(8px)',
        opacity: 0,
      },
      to: {
        transform: 'translate(0)',
        opacity: 1,
      },
    },
  ],
};

export default {
  fade,
  fadeInUp,
  fadeInNext,
  fadeInDown,
  fadeInSlowLeft,
  fadeInSlowRight,
  fadeInUpNoBounce,
};
