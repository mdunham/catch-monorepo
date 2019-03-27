import { compose } from 'redux';

import { injectReducer, injectSaga } from '@catch/utils';

import Navigation, { registerBankScreens } from './navigation';
import { saga, reducer, NAME } from '../store';

const withReducer = injectReducer({ key: NAME, reducer });
const withSaga = injectSaga({ key: NAME, saga });

const enhance = compose(
  withReducer,
  withSaga,
);

export { registerBankScreens };
export const Main = enhance(Navigation);
