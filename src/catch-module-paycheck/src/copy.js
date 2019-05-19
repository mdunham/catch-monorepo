import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'catch.paycheck.PaycheckView';
export default {
  headline: <FormattedMessage id={`${PREFIX}.headline`} />,
  subHeadline: <FormattedMessage id={`${PREFIX}.subHeadline`} />,
  paycheckLabel: <FormattedMessage id={`${PREFIX}.paycheckLabel`} />,
  paycheckDate: values => (
    <FormattedMessage id={`${PREFIX}.paycheckDate`} values={values} />
  ),
  paycheckName: <FormattedMessage id={`${PREFIX}.paycheckName`} />,
  planLabel: <FormattedMessage id={`${PREFIX}.planLabel`} />,
  editButton: <FormattedMessage id={`${PREFIX}.editButton`} />,
  totalSavings: <FormattedMessage id={`${PREFIX}.totalSavings`} />,
  depositButton: values => (
    <FormattedMessage id={`${PREFIX}.depositButton`} values={values} />
  ),
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
  'InsufficientFundsModal.title': (
    <FormattedMessage id="catch.paycheck.InsufficientFundsModal.title" />
  ),
  'InsufficientFundsModal.p1': values => (
    <FormattedMessage
      id="catch.paycheck.InsufficientFundsModal.p1"
      values={values}
    />
  ),
  'InsufficientFundsModal.p2': (
    <FormattedMessage id="catch.paycheck.InsufficientFundsModal.p2" />
  ),
  'InsufficientFundsModal.dismissText': (
    <FormattedMessage id="catch.paycheck.InsufficientFundsModal.dismissText" />
  ),
  'LimitedFundsModal.title': (
    <FormattedMessage id="catch.paycheck.LimitedFundsModal.title" />
  ),
  'LimitedFundsModal.p1': (
    <FormattedMessage id="catch.paycheck.LimitedFundsModal.p1" />
  ),
  'LimitedFundsModal.p2': values => (
    <FormattedMessage
      id="catch.paycheck.LimitedFundsModal.p2"
      values={values}
    />
  ),
  'LimitedFundsModal.dismissText': (
    <FormattedMessage id="catch.paycheck.LimitedFundsModal.dismissText" />
  ),
  'LimitedFundsModal.confirmText': (
    <FormattedMessage id="catch.paycheck.LimitedFundsModal.confirmText" />
  ),
  toastTitle: <FormattedMessage id={`catch.plans.ConfirmView.title`} />,
  toastSubtitle: values => (
    <FormattedMessage id={`catch.plans.ConfirmView.subtitle`} values={values} />
  ),
  loadingMessage: (
    <FormattedMessage id={`catch.plans.ConfirmView.loadingMessage`} />
  ),
  successMessage: (
    <FormattedMessage id={`catch.plans.ConfirmView.successMessage`} />
  ),
  'BankSyncErrorModal.title': (
    <FormattedMessage id="catch.paycheck.BankSyncErrorModal.title" />
  ),
  'BankSyncErrorModal.p1': values => (
    <FormattedMessage
      id="catch.paycheck.BankSyncErrorModal.p1"
      values={values}
    />
  ),
  'BankSyncErrorModal.p2': (
    <FormattedMessage id="catch.paycheck.BankSyncErrorModal.p2" />
  ),
  'BankSyncErrorModal.dismissText': (
    <FormattedMessage id="catch.paycheck.BankSyncErrorModal.dismissText" />
  ),
  'BankSyncErrorModal.updateText': (
    <FormattedMessage id="catch.paycheck.BankSyncErrorModal.updateText" />
  ),
  ptopDescription: <FormattedMessage id={`${PREFIX}.ptoDescription`} />,
  taxDescription: <FormattedMessage id={`${PREFIX}.taxDescription`} />,
  retirementDescription: (
    <FormattedMessage id={`${PREFIX}.retirementDescription`} />
  ),
};
