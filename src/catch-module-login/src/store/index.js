// import { compose } from 'redux';
// Refactor into its own shared module
import { DAEMON, injectSaga } from '@catch/utils';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import saga from './saga';
import { NAME } from './duck';
import * as sel from './selectors';

// Components

const withConnect = connect(
  createStructuredSelector({
    isAuthenticated: sel.getIsAuthenticated,
  }),
);
export const withSaga = injectSaga({ key: NAME, saga, mode: DAEMON });

// const enhance = compose(withConnect);

// export default enhance(Component);
