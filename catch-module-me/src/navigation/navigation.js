import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Switch, Redirect, Route } from 'react-router-dom';
import { push, getLocation } from 'react-router-redux';

// Layouts
import {
  Box,
  PageWrapper,
  SplitLayout,
  colors,
  withDimensions,
  size,
  Figure,
} from '@catch/rio-ui-kit';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import {
  MeView,
  UserDetailsView,
  LinkedAccountsView,
  AccountSettingsView,
  StatementsView,
  DisclosuresView,
  ReferralView,
  UpdateSSNView,
  ContactsView,
} from '../views';

const sidebarWidth = 260;

// Calculates padding based on the page maxWidth that the PageWrapper sets up
const calcPadding = w =>
  w - size.pageMaxWidth < 0 ? 0 : (w - size.pageMaxWidth) / 2;

export const MeNavigation = ({
  match: { path },
  push,
  location,
  size: dims,
  viewport,
}) => (
  <Box
    flex={1}
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: colors['peach+2'],
    }}
    row={viewport !== 'PhoneOnly'}
  >
    {viewport !== 'PhoneOnly' && (
      <React.Fragment>
        <Box pl={viewport !== 'PhoneOnly' ? calcPadding(dims.window.width) : 4}>
          <MeView
            push={push}
            pl={calcPadding(dims.window.width)}
            location={location}
          />
        </Box>
        <Box absolute style={{ left: 0, bottom: 0 }}>
          <Figure name="topo" />
        </Box>
      </React.Fragment>
    )}
    <ErrorBoundary Component={ErrorMessage}>
      <Switch>
        <Route path={`${path}/info`} component={UserDetailsView} />
        <Route path={`${path}/people`} component={ContactsView} />
        <Route path={`${path}/accounts`} component={LinkedAccountsView} />
        <Route path={`${path}/disclosures`} component={DisclosuresView} />
        <Route path={`${path}/statements`} component={StatementsView} />
        <Route path={`${path}/settings`} component={AccountSettingsView} />
        <Route
          path={`${path}/referral`}
          render={props => (
            // Pass the pr so we can respect it in the colorful banner
            <ReferralView {...props} pr={calcPadding(dims.window.width)} />
          )}
        />
        <Route
          path={`${path}/update-social`}
          render={props => <UpdateSSNView push={push} {...props} />}
        />
        {viewport === 'PhoneOnly' && (
          <Route
            path={`${path}`}
            render={() => <MeView push={push} location={location} />}
          />
        )}
        <Redirect to={`${path}/info`} />
      </Switch>
    </ErrorBoundary>
  </Box>
);

MeNavigation.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.shape({ path: PropTypes.string }).isRequired,
  push: PropTypes.func.isRequired,
  viewport: PropTypes.string,
};

export function registerProfileScreens() {}

const withRedux = connect(
  state => ({
    location: getLocation(state),
  }),
  { push },
);

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(MeNavigation);
