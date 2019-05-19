import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

import { AnalyticsProvider } from '@catch/utils';
import LinkBank from '@catch/link-bank';
import Paycheck from '@catch/paycheck';
import MeView from '@catch/me';
import { withNotifications } from '@catch/common';
import { AutoSignOut } from '@catch/login';
import HomeView from '@catch/home';
import GuideView from '@catch/guide';

/**
 * See that view's folder for plan related flows
 */
import PlanView from 'web/views/PlanView';
import AuthenticatedSupport from 'web/components/AuthenticatedSupport';
import NotFoundView from 'web/views/NotFoundView/Async';

const VIEWER_INFO = gql`
  query ViewerInfo {
    viewer {
      user {
        id
        givenName
        familyName
        email
        confidence {
          ptoConfidence
        }
        workType
      }
    }
  }
`;

const AuthenticatedView = ({ path, ...rest }) => (
  <Query query={VIEWER_INFO}>
    {({ loading, error, data }) => {
      if (error || loading) return null;
      const confidence = access(data, 'viewer.user.confidence.ptoConfidence');
      const givenName = access(data, 'viewer.user.givenName');
      const familyName = access(data, 'viewer.user.familyName');
      const email = access(data, 'viewer.user.email');
      const userId = access(data, 'viewer.user.id');
      const workType = access(data, 'viewer.user.workType');
      return (
        <AnalyticsProvider
          email={email}
          givenName={givenName}
          familyName={familyName}
          userId={userId}
          {...rest}
        >
          <Fragment>
            <Switch>
              <Route
                path={`${path}/`}
                exact
                render={props => (
                  <HomeView givenName={givenName} email={email} {...props} />
                )}
              />
              <Route
                path={`${path}/plan`}
                render={props => (
                  <PlanView
                    givenName={givenName}
                    {...props}
                    workType={workType}
                  />
                )}
              />
              <Route path={`${path}/guide`} component={GuideView} />
              <Route path={`${path}/me`} component={MeView} />
              <Route
                path={`${path}/paycheck/:paycheckId`}
                component={Paycheck}
              />
              <Route path={`${path}/link-bank`} component={LinkBank} />
              {/* ios might add this to our url so we redirect back to '/' */}
              <Route
                path={`${path}/index.html`}
                render={props => <Redirect to="/" />}
              />
              <Route path={`${path}/`} component={NotFoundView} />
            </Switch>
            <AuthenticatedSupport {...rest} />
            <AutoSignOut userInfo={{ email, givenName }} />
          </Fragment>
        </AnalyticsProvider>
      );
    }}
  </Query>
);
AuthenticatedView.propTypes = {
  path: PropTypes.string.isRequired,
};

const enhance = compose(
  lifecycle({
    componentDidMount() {
      // HomeView.preload();
      NotFoundView.preload();
    },
  }),
  withNotifications,
);

export default enhance(AuthenticatedView);
