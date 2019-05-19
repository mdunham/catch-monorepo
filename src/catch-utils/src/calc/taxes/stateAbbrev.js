import { STATES } from '../../const';

export function stateToFileName(state) {
  if (!Object.keys(STATES).includes(state)) {
    throw new Error(`Unknown state.  Received ${state}`);
  }

  return STATES[state]
    .split(' ')
    .map(s => s.toLowerCase())
    .join('_');
}
