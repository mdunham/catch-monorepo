/**
 * Take an array of dependents as an input and
 * returns a string describing the dependents
 */
export function formatDependents(dependents) {
  if (dependents.length <= 1) {
    return null;
  }
  // We count each dependent
  const depMap = dependents.reduce(
    (map, dep) => {
      if (dep.relation === 'SELF') {
        return map;
      }
      if (dep.relation === 'SPOUSE') {
        map.spouse++;
      } else {
        map.dependents++;
      }
      return map;
    },
    {
      spouse: 0,
      dependents: 0,
    },
  );

  if (depMap.spouse > 0 && depMap.dependents === 1) {
    return `Covering you, your spouse and 1 dependent`;
  } else if (depMap.spouse > 0 && depMap.dependents > 1) {
    return `Covering you, your spouse and ${depMap.dependents} dependents`;
  } else if (depMap.spouse > 0) {
    return `Covering you and your spouse`;
  } else if (depMap.dependents === 1) {
    return `Covering you and 1 dependent`;
  } else if (depMap.dependents > 1) {
    return `Covering you and ${depMap.dependents} dependents`;
  } else {
    return null;
  }
}
