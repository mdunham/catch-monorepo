/**
 * This desperately needs to refactored along with
 * AccountSelectionContextModal to be a singular
 * entity in @catch/common, where it can function autonomously
 * anywhere in the app
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Text } from 'react-native';
import { compose } from 'redux';

import { UpdateInfoModal } from '@catch/common';
import {
  USER_INFO,
  UpdateIncomeState,
  UpdateFilingStatus,
  FilingStatusField,
  WorkStateField,
  SpouseIncomeField,
  UpdateIncome,
  UserIncomeField,
  setIncomeFieldName,
  selectIncome,
  AdjustTaxesView,
} from '@catch/common';
import { toastActions } from '@catch/errors';
import { filingStatusesLowerCase, formatCurrency, STATES } from '@catch/utils';
import { withDimensions } from '@catch/rio-ui-kit';

import { UpdateTaxGoal } from '../containers';
import { UpdateTaxDependentsView } from '../views';

// @TODO this could be refactored into a single message/title
const PREFIX = 'catch.plans.updateUserContext';
export const COPY = {
  'annualIncome.title': (
    <FormattedMessage id={`${PREFIX}.annualIncome.title`} />
  ),
  'annualIncome.msg': values => (
    <FormattedMessage id={`${PREFIX}.annualIncome.msg`} values={values} />
  ),
  'incomeState.title': <FormattedMessage id={`${PREFIX}.incomeState.title`} />,
  'incomeState.msg': values => (
    <FormattedMessage id={`${PREFIX}.incomeState.msg`} values={values} />
  ),
  'filingStatus.title': (
    <FormattedMessage id={`${PREFIX}.filingStatus.title`} />
  ),
  'filingStatus.msg': values => (
    <FormattedMessage id={`${PREFIX}.filingStatus.msg`} values={values} />
  ),
  'spouseIncome.title': (
    <FormattedMessage id={`${PREFIX}.spouseIncome.title`} />
  ),
  'spouseIncome.msg': values => (
    <FormattedMessage id={`${PREFIX}.spouseIncome.msg`} values={values} />
  ),
  'numDependents.title': (
    <FormattedMessage id={`${PREFIX}.numDependents.title`} />
  ),
  'numDependents.msg': values => (
    <FormattedMessage id={`${PREFIX}.numDependents.msg`} values={values} />
  ),
};

export const TaxesContextModal = ({
  workState,
  workType,
  estimatedW2Income,
  estimated1099Income,
  filingStatus,
  spouseIncome,
  showModal,
  formValues,
  popToast,
  onClose,
  breakpoints,
  paycheckPercentage,
  incomeState,
}) => {
  switch (showModal) {
    case 'workState':
      return (
        <UpdateIncomeState
          stateInput={{ state: formValues.workState }}
          refetchQueries={[{ query: USER_INFO }]}
          onCompleted={() => {
            popToast({
              title: COPY['incomeState.title'],
              msg: COPY['incomeState.msg']({
                state: STATES[formValues.workState],
              }),
              type: 'success',
            });
            onClose();
          }}
        >
          {({ updateIncomeState }) => (
            <UpdateInfoModal onSave={updateIncomeState} onCancel={onClose}>
              <WorkStateField form="workState" initialValues={{ workState }} />
            </UpdateInfoModal>
          )}
        </UpdateIncomeState>
      );
    case 'annualIncome':
      return (
        <UpdateIncome
          refetchQueries={[{ query: USER_INFO }]}
          onCompleted={() => {
            popToast({
              title: COPY['annualIncome.title'],
              msg: COPY['annualIncome.msg']({
                annualIncome: formatCurrency(
                  selectIncome(formValues, workType),
                ),
              }),
              type: 'success',
            });
            onClose();
          }}
        >
          {({ updateIncome }) => (
            <UpdateInfoModal
              onSave={() =>
                updateIncome({
                  variables: {
                    input: {
                      estimated1099Income: formValues.estimated1099Income,
                      estimatedW2Income: formValues.estimatedW2Income,
                    },
                  },
                })
              }
              onCancel={onClose}
            >
              <UserIncomeField
                form="annualIncome"
                name={setIncomeFieldName(workType)}
                labelType={
                  workType === 'WORK_TYPE_DIVERSIFIED' ? 'W2' : undefined
                }
                initialValues={{ estimated1099Income, estimatedW2Income }}
              />
              {workType === 'WORK_TYPE_DIVERSIFIED' && (
                <UserIncomeField
                  form="annualIncome"
                  name="estimated1099Income"
                  labelType="1099"
                  hideTooltip
                />
              )}
            </UpdateInfoModal>
          )}
        </UpdateIncome>
      );
    case 'filingStatus':
      return (
        <UpdateFilingStatus
          filingStatus={formValues.filingStatus}
          spouseIncome={{ estimatedIncome: formValues.spouseIncome }}
          refetchQueries={[{ query: USER_INFO }]}
          onCompleted={() => {
            if (formValues.filingStatus !== filingStatus) {
              popToast({
                title: COPY['filingStatus.title'],
                msg: COPY['filingStatus.msg']({
                  filingStatus:
                    filingStatusesLowerCase[formValues.filingStatus],
                }),
                type: 'success',
              });
            }
            if (
              formValues.filingStatus === 'MARRIED' &&
              formValues.spouseIncome !== spouseIncome
            ) {
              popToast({
                title: COPY['spouseIncome.title'],
                msg: COPY['spouseIncome.msg']({
                  spouseIncome: formatCurrency(formValues.spouseIncome),
                }),
                type: 'success',
              });
            }
            onClose();
          }}
        >
          {({ updateFilingStatus }) => (
            <UpdateInfoModal onSave={updateFilingStatus} onCancel={onClose}>
              <FilingStatusField
                form="filingStatus"
                initialValues={{ filingStatus, spouseIncome }}
              />
              {formValues.filingStatus === 'MARRIED' && (
                <SpouseIncomeField form="filingStatus" />
              )}
            </UpdateInfoModal>
          )}
        </UpdateFilingStatus>
      );
    case 'numDependents':
      return (
        <UpdateTaxGoal>
          {({ upsertTaxGoal }) => (
            <UpdateTaxDependentsView
              onCancel={onClose}
              breakpoints={breakpoints}
              upsertTaxGoal={upsertTaxGoal}
              incomeState={incomeState}
              workType={workType}
              estimatedW2Income={estimatedW2Income}
              estimated1099Income={estimated1099Income}
              filingStatus={filingStatus}
              spouseIncome={spouseIncome}
              paycheckPercentage={paycheckPercentage}
            />
          )}
        </UpdateTaxGoal>
      );

    default:
      return null;
  }
};

TaxesContextModal.propTypes = {
  workState: PropTypes.string,
  estimatedW2Income: PropTypes.number,
  estimated1099Income: PropTypes.number,
  filingStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  spouseIncome: PropTypes.number,
  showModal: PropTypes.string,
  formValues: PropTypes.object,
  popToast: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const selectWorkState = formValueSelector('workState');
const selectFilingStatus = formValueSelector('filingStatus');
const selectUserIncome = formValueSelector('annualIncome');
const selectDependents = formValueSelector('TaxGoal');

const withRedux = connect(
  state => ({
    formValues: {
      workState: selectWorkState(state, 'workState'),
      estimated1099Income: selectUserIncome(state, 'estimated1099Income'),
      estimatedW2Income: selectUserIncome(state, 'estimatedW2Income'),
      numDependents: selectDependents(state, 'numDependents'),
      ...selectFilingStatus(state, 'filingStatus', 'spouseIncome'),
    },
  }),
  { ...toastActions },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

const Component = enhance(TaxesContextModal);
Component.displayName = 'TaxesContextModal';

export default Component;
