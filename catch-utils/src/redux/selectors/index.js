// createLocalSelector is a higher order function that creates a selector which
// can then be used to target this specific modules namespace.
export function createLocalSelector(namespace) {
  return function selector(key) {
    return state => state[namespace][key];
  };
}
