import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LogRocket from 'logrocket';

import Env from '../env';
import Heap from './Heap';
import { setSentryUser } from '../logger';
import Segment from './Segment';

const mockMP = {
  people: {},
  init: () => {},
  identify: () => {},
  track: () => {},
  register: () => {},
};

class AnalyticsProvider extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    userId: PropTypes.string,
    email: PropTypes.string,
    givenName: PropTypes.string,
    familyName: PropTypes.string,
  };

  componentDidMount() {
    const { email, givenName, familyName, userId } = this.props;

    if (Env.isProdLike) {
      const analytics = Segment.analytics;
      analytics.identify(userId, {
        givenName,
        familyName,
        email,
      });
    }

    if (Env.isProd) {
      /*
       * Here we initialize the LogRocket platform, which records every single
       * user session. Adding here because we only want to capture
       * Authenticated sessions.
       *
       * https://app.logrocket.com/6an89b/catch-production/settings/setup
       */
      LogRocket.init('6an89b/catch-production', {
        network: {
          requestSanitizer: request => {
            if (
              request.url.toLowerCase() ===
              'https://cognito-idp.us-west-2.amazonaws.com/'
            ) {
              request.body = null;
            }

            return request;
          },
        },
      });

      LogRocket.identify(userId, {
        name: `${givenName} ${familyName}`,
        email,
      });

      setSentryUser({ email, id: userId });
    }
  }

  render() {
    const { userId, email, givenName, familyName } = this.props;

    const hasData = !!email && !!givenName && !!familyName;

    return (
      <Fragment>
        {hasData && (
          <Heap
            userId={email}
            userData={{
              firstName: givenName,
              lastName: familyName,
              email: email,
              catchId: userId,
            }}
          />
        )}
        {this.props.children}
      </Fragment>
    );
  }
}

// Only render when not in development
// const enhance = branch(props => Env.isLocal || Env.isHandoff, renderNothing);
export default AnalyticsProvider;
