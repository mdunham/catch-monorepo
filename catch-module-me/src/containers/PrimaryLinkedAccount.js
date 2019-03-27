import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { GetLinkedAccounts, PrimaryAccount } from '@catch/common';
import {
  Paper,
  Spinner,
  Flex,
  Box,
  Placeholder,
  Text,
} from '@catch/rio-ui-kit';
import { Error } from '@catch/errors';
import { goTo, navigationPropTypes, createLogger } from '@catch/utils';

import AccountRow from '../components/AccountRow';

const Log = createLogger('primary-linked-account');

const PREFIX = 'catch.module.me.LinkedAccounts';

export class PrimaryLinkedAccount extends Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);

    this.goTo = goTo.bind(this);
  }

  render() {
    const {
      intl: { formatMessage },
      push,
    } = this.props;
    return (
      <PrimaryAccount>
        {({
          loading,
          error,
          hasBankLinks,
          primaryAccount,
          syncStatus,
          bank,
          bankLinkID,
        }) =>
          loading ? (
            <Spinner />
          ) : primaryAccount ? (
            <Paper p={1} qaName="primary-account-card">
              <AccountRow
                onButtonClick={
                  syncStatus === 'LOGIN_ERROR'
                    ? () => this.goTo('/link-bank', { bank, bankLinkID })
                    : undefined
                }
                denotePrimary
                {...primaryAccount}
                syncStatus={syncStatus}
                bankName={bank.name}
              />
            </Paper>
          ) : hasBankLinks ? (
            <Placeholder>
              {formatMessage({ id: `${PREFIX}.primaryAccountCta` })}
            </Placeholder>
          ) : (
            <Placeholder>
              {formatMessage({ id: `${PREFIX}.placeholder` })}
            </Placeholder>
          )
        }
      </PrimaryAccount>
    );
  }
}

const withPush = connect(
  undefined,
  { push },
);

const enhance = compose(
  injectIntl,
  withPush,
);

export default enhance(PrimaryLinkedAccount);
