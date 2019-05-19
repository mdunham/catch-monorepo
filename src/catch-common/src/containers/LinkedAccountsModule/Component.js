import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createLogger } from '@catch/utils';

const Log = createLogger('linked-accounts-module');

const noop = () => {};

/**
 * Linked accounts module, data component for retrieving bank links and associated accounts
 */

class LinkedAccountsModule extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,

    // Hooks
    onSetPrimaryAccountSuccess: PropTypes.func,
    onSetPrimaryAccountFail: PropTypes.func,
    onDeleteBankLinkSuccess: PropTypes.func,
    onDeleteBankLinkFail: PropTypes.func,

    // Apollo State
    loading: PropTypes.bool,
    error: PropTypes.string,

    //Redux events
    didSetPrimaryAccount: PropTypes.func.isRequired,
    deletedBankLink: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onSetPrimaryAccountSuccess: noop,
    onSetPrimaryAccountFail: noop,
    onDeleteBankLinkSuccess: noop,
    onDeleteBankLinkFail: noop,
  };

  /*
   * sets primary account
   *
   * @param {string}  id - the account ID
   * @param {boolean} value - usually TRUE, the value to send to gql
   */
  onSetPrimaryAccount = (id, value) => {
    this.props
      .setPrimaryAccount({ id, value })
      .then(({ data }) => {
        Log.info(data);
        this.props.onSetPrimaryAccountSuccess(data);
        this.props.didSetPrimaryAccount(data);
      })
      .catch(e => {
        Log.error(e);
        this.props.onSetPrimaryAccountFail(e.message);
        this.props.failedSetPrimaryAccount(e.message);
      });
  };

  /*
   * deletes a bank link
   *
   * @param {string}  id - the account ID
   */
  onDeleteBankLink = id => {
    this.props
      .deleteBankLink(id)
      .then(({ data }) => {
        this.props.deletedBankLink(data);
      })
      .catch(e => {
        Log.error('failed banklink deletion:', e);
        this.props.failedDeleteBankLink(e.message);
      });
  };

  get initialValues() {
    const { viewer } = this.props;
    // when deleting and refetching, viewer is sometimes null
    // return an empty object to avoid throwing in render()
    if (typeof viewer === 'undefined') {
      return {};
    }
    const { bankLinks, primaryAccount } = viewer;
    return { bankLinks, primaryAccount };
  }

  render() {
    const { initialValuesError, initialValuesLoading, render } = this.props;

    if (!initialValuesLoading) {
      return render({
        bankLinks: this.initialValues.bankLinks,
        initialValuesError,
        initialValuesLoading,
        handleDeleteBankLink: this.onDeleteBankLink,
        handleSetPrimaryAccount: this.onSetPrimaryAccount,
        primaryAccount: this.initialValues.primaryAccount,
      });
    } else {
      return render({
        initialValuesError,
        initialValuesLoading,
      });
    }
  }
}

export default LinkedAccountsModule;
