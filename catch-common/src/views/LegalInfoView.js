import React from 'react';
import PropTypes from 'prop-types';
import { getFormValues, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { LegalReviewModal, UserInfo } from '../containers';

export const LegalInfoView = ({ onConfirm, onRequestClose, needed }) => (
  <UserInfo>
    {({ loading, legalName, dob, legalAddress, ssn }) => (
      <LegalReviewModal
        onConfirm={onConfirm}
        onEdit={onRequestClose}
        legalName={legalName}
        dob={dob}
        legalAddress={legalAddress}
        ssn={ssn}
        needed={needed}
        loading={loading}
      />
    )}
  </UserInfo>
);

LegalInfoView.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  needed: PropTypes.array.isRequired,
};

export default LegalInfoView;
