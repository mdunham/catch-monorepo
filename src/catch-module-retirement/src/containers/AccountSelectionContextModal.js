/**
 * This desperately needs to refactored along with
 * TaxesContextModal to be a singular entity in @catch/common, where it
 * can function autonomously anywhere in the app
 */

import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  USER_INFO,
  UpdateFilingStatus,
  FilingStatusField,
  SpouseIncomeField,
  UpdateIncome,
  UserIncomeField,
  UpdateInfoModal,
  setIncomeFieldName,
  selectIncome,
} from '@catch/common';
import { toastActions } from '@catch/errors';
import { filingStatusesLowerCase, formatCurrency, STATES } from '@catch/utils';

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

const AccountSelectionContextModal = ({
  workType,
  filingStatus,
  annualIncome,
  estimated1099Income,
  estimatedW2Income,
  spouseIncome,
  showModal,
  onClose,
  onCloseWithChanges,
  formValues,
  popToast,
}) => {
  switch (showModal) {
    case 'all':
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
            onCloseWithChanges();
          }}
        >
          {({ updateFilingStatus }) => (
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
                updateFilingStatus();
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
                    initialValues={{ estimatedW2Income, estimated1099Income }}
                  />
                  {workType === 'WORK_TYPE_DIVERSIFIED' && (
                    <UserIncomeField
                      form="annualIncome"
                      name="estimated1099Income"
                      labelType="1099"
                      hideTooltip
                    />
                  )}
                  <FilingStatusField
                    form="filingStatus"
                    initialValues={{ filingStatus, spouseIncome }}
                  />
                  {formValues.filingStatus === 'MARRIED' && (
                    <SpouseIncomeField form="filingStatus" />
                  )}
                </UpdateInfoModal>
              )}
            </UpdateIncome>
          )}
        </UpdateFilingStatus>
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
            onCloseWithChanges();
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
            onCloseWithChanges();
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
                initialValues={{ estimatedW2Income, estimated1099Income }}
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
    default:
      return null;
  }
};

AccountSelectionContextModal.propTypes = {
  annualIncome: PropTypes.number.isRequired,
  filingStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  spouseIncome: PropTypes.number,
  showModal: PropTypes.string,
  formValues: PropTypes.object,
  popToast: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const selectFilingStatus = formValueSelector('filingStatus');
const selectUserIncome = formValueSelector('annualIncome');

export default connect(
  state => ({
    formValues: {
      estimated1099Income: selectUserIncome(state, 'estimated1099Income'),
      estimatedW2Income: selectUserIncome(state, 'estimatedW2Income'),
      ...selectFilingStatus(state, 'filingStatus', 'spouseIncome'),
    },
  }),
  { ...toastActions },
)(AccountSelectionContextModal);
