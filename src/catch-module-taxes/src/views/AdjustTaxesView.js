import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import { ValidateGoal, UpdateInfoModal } from '@catch/common';
import { Box, Text, withDimensions } from '@catch/rio-ui-kit';
import { ErrorBoundary, ErrorMessage, toastActions } from '@catch/errors';
import {
  precisionRound,
  formatCurrency,
  Currency,
  Percentage,
} from '@catch/utils';

import { CalculateTaxes, UpdateTaxGoal } from '../containers';
import { EstimatorForm } from '../forms';

const MONTHS_PER_YEAR = 12;

const PREFIX = 'catch.module.taxes.AdjustTaxesView';
export const COPY = {
  contribution: values => (
    <FormattedMessage id={`${PREFIX}.contribution`} values={values} />
  ),
  description: values => (
    <FormattedMessage id={`${PREFIX}.description`} values={values} />
  ),
  'description.1099': values => (
    <FormattedMessage id={`${PREFIX}.description.1099`} values={values} />
  ),
  modalTitle: <FormattedMessage id={`${PREFIX}.modalTitle`} />,
  disclosure1: <FormattedMessage id={`${PREFIX}.disclosure1`} />,
  disclosure2: values => (
    <FormattedMessage id={`${PREFIX}.disclosure2`} values={values} />
  ),
};

export class AdjustTaxesView extends React.Component {
  static propTypes = {
    manualAdjustment: PropTypes.number,
    popToast: PropTypes.func,
    toggleModal: PropTypes.func,
  };

  handleCompleted = ({ toggleModal }) => {
    const { popToast } = this.props;

    popToast({
      title: 'Tax withholding updated',
      msg: "Your tax plan's withholding percentage has been updated",
      type: 'success',
    });
    toggleModal();
  };

  render() {
    const manualAdjustment = precisionRound(this.props.manualAdjustment, 2);

    const { toggleModal, viewport } = this.props;

    const isMobile = viewport === 'PhoneOnly';

    return (
      <ErrorBoundary component={ErrorMessage}>
        <UpdateTaxGoal
          onCompleted={() => this.handleCompleted({ toggleModal })}
        >
          {({ upsertTaxGoal, saving }) => (
            <CalculateTaxes>
              {({
                loading,
                currentPaycheckPercentage,
                reccPaycheckPercentage,
                grossIncome,
                workType,
                estimated1099Income,
                goalID,
              }) => {
                const adjustedValue =
                  manualAdjustment === currentPaycheckPercentage
                    ? currentPaycheckPercentage
                    : precisionRound(
                        manualAdjustment + currentPaycheckPercentage,
                        2,
                      );
                const hasChanged = !!manualAdjustment && manualAdjustment !== 0;

                const monthlyContribution =
                  adjustedValue * (estimated1099Income / MONTHS_PER_YEAR);

                return (
                  <UpdateInfoModal
                    onCancel={toggleModal}
                    showDescription={false}
                    title={COPY['modalTitle']}
                    loading={loading}
                    onSave={() => {
                      upsertTaxGoal({
                        variables: {
                          input: {
                            paycheckPercentage: adjustedValue,
                          },
                        },
                      });
                    }}
                    canSave={!saving && hasChanged}
                    isSaving={saving}
                  >
                    <ValidateGoal id={goalID} percentage={adjustedValue}>
                      {({ validationError }) => (
                        <Box mb={3}>
                          <EstimatorForm
                            adjustmentError={validationError}
                            isEditing={true}
                            percent={
                              hasChanged
                                ? adjustedValue
                                : currentPaycheckPercentage
                            }
                            reccPaycheckPercentage={reccPaycheckPercentage}
                            description={COPY[
                              workType === 'WORK_TYPE_DIVERSIFIED'
                                ? 'description.1099'
                                : 'description'
                            ]({
                              contribution: (
                                <Text weight="medium">
                                  <Currency>{monthlyContribution}</Currency> per
                                  month
                                </Text>
                              ),
                              annualIncome: (
                                <Text weight="medium">
                                  {formatCurrency(estimated1099Income)}
                                </Text>
                              ),
                            })}
                            initialValues={{ paycheckPercentage: 0 }}
                            isLoading={loading}
                          />
                          <Text mt={3} size="small">
                            {COPY['disclosure1']}
                          </Text>
                          {!isMobile && (
                            <Text mt={2} size="small">
                              {COPY['disclosure2']({
                                percentage: (
                                  <Text size="small" weight="bold">
                                    <Percentage whole>
                                      {reccPaycheckPercentage}
                                    </Percentage>
                                  </Text>
                                ),
                              })}
                            </Text>
                          )}
                        </Box>
                      )}
                    </ValidateGoal>
                  </UpdateInfoModal>
                );
              }}
            </CalculateTaxes>
          )}
        </UpdateTaxGoal>
      </ErrorBoundary>
    );
  }
}

const withRedux = connect(
  state => ({
    manualAdjustment: formValueSelector('TaxEstimatorForm')(
      state,
      'paycheckPercentage',
    ),
  }),
  toastActions,
);

const enhance = compose(
  withRedux,
  withDimensions,
);

const Component = enhance(AdjustTaxesView);
Component.displayName = 'AdjustTaxesView';

export default Component;
