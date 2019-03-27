import { matchPath } from 'react-router-dom';

// Add any path there to have the FlowBar rendered
const PATHS = [
  '/estimator',
  '/legal',
  '/identity-verification',
  '/access-denied',
  '/pending-review',
  '/confirm',
  '/agreement',
  '/current-savings',
  '/risk-level',
  '/risk-comfort',
  '/portfolio',
  '/account',
  '/ineligible',
  '/regulatory',
  '/investment-agreement',
];
export const showFlowBar = (root, location) => {
  for (let i = 0, n = PATHS.length; i < n; i++) {
    const match = matchPath(location, { path: `${root}${PATHS[i]}` });
    if (match) {
      return true;
    }
  }
  return false;
};

export const calcProgress = (steps, current) => {
  const total = steps.length;
  const parts = current.split('/');
  const pathName = parts[parts.length - 1];
  const step = steps.indexOf(pathName) + 1;
  return {
    total,
    step,
  };
};
