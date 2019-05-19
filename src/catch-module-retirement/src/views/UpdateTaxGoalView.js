import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Box, Text } from '@catch/rio-ui-kit';
import { QuickUpdateGoalLayout } from '@catch/common';
import { CalculateTaxes, UpdateTaxGoal } from '@catch/taxes';
import { toastActions } from '@catch/errors';

const PREFIX = 'catch.module.retirement.UpdateTaxGoalView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: values => (
    <FormattedMessage id={`${PREFIX}.description`} values={values} />
  ),
  descriptionEmphasis: (
    <FormattedMessage id={`${PREFIX}.descriptionEmphasis`} />
  ),
};

export const UpdateTaxGoalView = ({ toggleModal, popToast }) => (
  <CalculateTaxes>
    {({
      currentPaycheckPercentage,
      reccPaycheckPercentage,
      currentMonthlyContribution,
      reccMonthlyContribution,
      loading,
    }) =>
      loading ? null : (
        <UpdateTaxGoal
          onCompleted={() => {
            popToast({
              title: 'Tax withholding updated',
              msg: `Your tax plan has been updated to ${reccPaycheckPercentage *
                100}%`,
              type: 'success',
            });
            toggleModal();
          }}
        >
          {({ upsertTaxGoal }) => (
            <QuickUpdateGoalLayout
              title={COPY['title']}
              description={COPY['description']({
                emphasis: (
                  <Text weight="medium">{COPY['descriptionEmphasis']}.</Text>
                ),
              })}
              currentPercentage={currentPaycheckPercentage}
              currentMonthlyContribution={currentMonthlyContribution}
              reccPercentage={reccPaycheckPercentage}
              reccMonthlyContribution={reccMonthlyContribution}
              keep={toggleModal}
              update={() =>
                upsertTaxGoal({
                  variables: {
                    input: {
                      paycheckPercentage: reccPaycheckPercentage,
                    },
                  },
                })
              }
            />
          )}
        </UpdateTaxGoal>
      )
    }
  </CalculateTaxes>
);

UpdateTaxGoalView.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  popToast: PropTypes.func,
};

export default connect(
  undefined,
  { ...toastActions },
)(UpdateTaxGoalView);
