import { Log } from '@catch/utils';
import { isUndefined } from 'lodash';

// customSavingsRoute returns the path that draft savings goal live at.  We use
// a function to generate the path since it's used in a few places.
export function customSavingsRoute({ name, id }) {
  if (isUndefined(name) || isUndefined(id)) {
    Log.error(
      `tried redirecting to savings route but was missing vars: name (${
        name
      }) id (${id})`,
    );
    return `/plan`;
  } else {
    return `/plan/savings/${name}/${id}`;
  }
}

export const planRoute = '/plan/';
export const bankLinkRoute = '/link-bank/';
