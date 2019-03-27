import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Intercom from 'react-intercom';
import { branch, renderNothing } from 'recompose';

import { Env } from '@catch/utils';
import * as Api from '@catch/login/src/store/endpoints';
import { withDimensions } from '@catch/rio-ui-kit';

/**
 * AuthenticatedSupport gets info about the current user and renders the
 * Intercom portal component
 *
 * https://github.com/nhagen/react-intercom/blob/master/src/index.js
 */
class AuthenticatedSupport extends Component {
  static propTypes = {
    location: PropTypes.object,
    viewport: PropTypes.string,
  };

  state = { user: null };

  componentDidMount() {
    Api.fetchCurrentUser().then(({ data: { viewer: { user } } }) => {
      const intercomUser = {
        user_id: user.id,
        name: `${user.givenName} ${user.familyName}`,
        email: user.email,
      };
      this.setState({ user: intercomUser });
    });
  }
  render() {
    const { location, viewport } = this.props;

    const showIntercom = [
      '/',
      '/plan',
      '/me/info',
      '/me/accounts',
      '/me/settings',
      '/me/statements',
      '/me/disclosures',
      '/plan/taxes/overview',
      '/plan/timeoff/overview',
      '/plan/retirement/overview',
    ];

    return this.state.user && showIntercom.includes(location.pathname) ? (
      <Intercom
        appID={Env.isProd ? 'pniw40fg' : 'qn5cenup'}
        vertical_padding={viewport === 'PhoneOnly' ? 84 : 20}
        {...this.state.user}
      />
    ) : null;
  }
}

// Only render Intercom when not in development
const withBranch = branch(props => Env.isLocal, renderNothing);
const enhance = (withBranch, withDimensions);

export default enhance(AuthenticatedSupport);
