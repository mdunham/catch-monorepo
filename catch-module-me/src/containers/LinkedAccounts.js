import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';

import { ErrorBoundary, ErrorMessage, toastActions } from '@catch/errors';
import { Box, Placeholder, Spinner } from '@catch/rio-ui-kit';
import { GetLinkedAccounts, DeleteBankLink } from '@catch/common';
import { accountRef, createLogger } from '@catch/utils';

import LinkedAccountTile from './LinkedAccountsTile';

const Log = createLogger('linked-accounts-component');

// TODO: we need to use a single mutation to handle for all
// scenarios with toast copy centralized there
const PREFIX = 'catch.module.link-bank.saga';

class LinkedAccounts extends React.PureComponent {
  static propTypes = {
    popToast: PropTypes.func.isRequired,
    popErrorToast: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func,
    }).isRequired,
  };

  setPrimaryAccountSuccess = ({
    setPrimaryAccount: { name, accountNumber },
  }) => {
    const {
      popToast,
      intl: { formatMessage },
    } = this.props;

    popToast({
      type: 'success',
      title: formatMessage({
        id: `${PREFIX}.setPrimaryAccount.successToast.title`,
      }),
      msg: formatMessage(
        {
          id: `${PREFIX}.setPrimaryAccount.successToast.msg`,
        },
        { account: accountRef({ accountName: name, accountNumber }) },
      ),
    });
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    return (
      <ErrorBoundary component={ErrorMessage}>
        <GetLinkedAccounts>
          {({ loading, error, bankLinks, activeBankLinks }) => {
            // @NOTE because of the fetchPolicy the component can already
            // have results in the cache while it's loading fresh results so we
            // can display them instead of showing a spinner forever
            if (!bankLinks && loading) {
              return <Spinner />;
            } else {
              Log.debug(activeBankLinks);

              if (bankLinks && bankLinks.length > 0) {
                return activeBankLinks.map(bl => (
                  <Box key={bl.id}>
                    <DeleteBankLink refetch>
                      {deleteBankLinkProps => (
                        <Box w={1} mb={2}>
                          <LinkedAccountTile
                            isPrimary={bl.accounts.some(a => a.isPrimary)}
                            onSetPrimaryAccount={this.setPrimaryAccountSuccess}
                            {...bl}
                            {...deleteBankLinkProps}
                          />
                        </Box>
                      )}
                    </DeleteBankLink>
                  </Box>
                ));
              } else {
                return (
                  <Placeholder>
                    {formatMessage({
                      id: `catch.module.me.LinkedAccounts.placeholder`,
                    })}
                  </Placeholder>
                );
              }
            }
          }}
        </GetLinkedAccounts>
      </ErrorBoundary>
    );
  }
}

const withConnect = connect(
  undefined,
  toastActions,
);

const enhance = compose(
  injectIntl,
  withConnect,
);

export default enhance(LinkedAccounts);
