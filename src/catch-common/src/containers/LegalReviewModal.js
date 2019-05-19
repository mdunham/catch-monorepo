import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { format } from 'date-fns';

import { createLogger } from '@catch/utils';
import { Box, Text, Spinner } from '@catch/rio-ui-kit';

import {
  AddressInfo,
  DobInfo,
  LegalInfoModal,
  // LegalNameInfo, // weirdness going on with imports
  // SSNInfo, // weirdness going on with imports
} from '../components';

import SSNInfo from '../components/SSNInfo'; // @TODO: put this pack in components import
import LegalNameInfo from '../components/LegalNameInfo'; // @TODO: put this pack in components import

const Log = createLogger('legal-review-modal');

const componentMap = {
  KYC_NAME: LegalNameInfo,
  KYC_ADDRESS: AddressInfo,
  KYC_DOB: DobInfo,
  KYC_SSN: SSNInfo,
};

export class LegalReviewModal extends Component {
  static propTypes = {
    dob: PropTypes.string.isRequired,
    legalAddress: PropTypes.object.isRequired,
    legalName: PropTypes.string.isRequired,
    ssn: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    needed: PropTypes.array.isRequired,
  };

  render() {
    const { onEdit, onConfirm, loading, needed } = this.props;

    const isMismatch = needed.includes('KYC_MISMATCH');
    const orderedStatuses = ['KYC_NAME', 'KYC_DOB', 'KYC_ADDRESS', 'KYC_SSN'];

    // honor the order to render dynamic info groups
    let filteredStatuses = [];
    orderedStatuses.forEach(status => {
      if (needed.includes(status)) {
        filteredStatuses.push(status);
      }
    });

    const renderStatuses = isMismatch ? orderedStatuses : filteredStatuses;

    Log.debug(renderStatuses);

    return (
      <LegalInfoModal onEdit={onEdit} onConfirm={onConfirm}>
        {loading ? (
          <Spinner large />
        ) : (
          renderStatuses.map((status, i) => {
            const Info = componentMap[status];

            return (
              <Box mb={3} key={`group-${i}`}>
                <Info {...this.props} />
              </Box>
            );
          })
        )}
      </LegalInfoModal>
    );
  }
}

export default LegalReviewModal;
