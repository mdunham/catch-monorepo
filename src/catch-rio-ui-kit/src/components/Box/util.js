import { space, media } from '../../const';

const num = n => typeof n === 'number' && !Number.isNaN(n);
const directions = {
  t: ['Top'],
  r: ['Right'],
  b: ['Bottom'],
  l: ['Left'],
  x: ['Left', 'Right'],
  y: ['Top', 'Bottom'],
};

export const width = (key, n) => {
  const toVal = val => (!num(val) || val > 1 ? val : val * 100 + '%');
  const keys = Object.keys(media);

  if (Array.isArray(n)) {
    return n.reduce((acc, val, idx) => {
      const k = keys[idx];
      const v = toVal(val);

      if (v !== null) {
        acc[k] = { width: v };
      }
      return acc;
    }, {});
  } else {
    const v = toVal(n);
    return { width: v };
  }
};

export const spaceToScale = (key, n) => {
  const [a, b] = key.split('');
  const prop = a === 'm' ? 'margin' : 'padding';
  const dirs = directions[b] || [''];
  const neg = n < 0 ? -1 : 1;

  // if not a number use the value --> ex: '23px'
  const toVal = n => (!num(n) ? n : (space[Math.abs(n)] || Math.abs(n)) * neg);

  if (Array.isArray(n)) {
    const keys = Object.keys(media);
    return n.reduce((acc, val, idx) => {
      const v = toVal(val);
      const k = keys[idx];

      if (typeof k !== 'undefined') {
        if (v !== null) {
          const inner = dirs.reduce((acc, d) => {
            acc[prop + d] = v;
            return acc;
          }, {});

          acc[k] = inner;
        }
      }
      return acc;
    }, {});
  } else {
    const val = toVal(n);
    return dirs.reduce((acc, d) => {
      acc[prop + d] = val;
      return acc;
    }, {});
  }
};

export const isDeprecated = (props, propName, componentName) => {
  return new Error(
    `Prop '${propName}' supplied to ${
      componentName
    } is deprecated and won't be used.`,
  );
};
