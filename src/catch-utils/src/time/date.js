import { format } from './index.js';

export function toGQLDate(date) {
  return format(date, 'YYYY-MM-DD');
}
