import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import { getFormValues } from 'redux-form';
import { connect } from 'react-redux';

import {
  Text,
  Page,
  ModalHeader,
  ModalTitle,
  Modal,
  ModalBody,
} from '@catch/rio-ui-kit';
import { toastActions } from '@catch/errors';
import { formatCurrency } from '@catch/utils';

import { USER_INFO, selectIncome } from './UserInfo';
import UpdateIncome from './UpdateIncome';
import { UserIncomeField, setIncomeFieldName } from '../forms';
import { UpdateInfoModal } from '../components';

const PREFIX = 'catch.plans.AdjustableAnnualIncome';
export const COPY = {
  'annualIncome.title': (
    <FormattedMessage id={`${PREFIX}.annualIncome.title`} />
  ),
  'annualIncome.msg': values => (
    <FormattedMessage id={`${PREFIX}.annualIncome.msg`} values={values} />
  ),
};

export const AdjustableAnnualIncome = ({
  formValues,
  popToast,
  estimated1099Income,
  estimatedW2Income,
  workType,
  onDismiss,
}) => (
  <UpdateIncome
    refetchQueries={[{ query: USER_INFO }]}
    onCompleted={() => {
      popToast({
        title: COPY['annualIncome.title'],
        msg: COPY['annualIncome.msg']({
          annualIncome: formatCurrency(selectIncome(formValues, workType)),
        }),
        type: 'success',
      });
      onDismiss();
    }}
  >
    {({ updateIncome }) => (
      <UpdateInfoModal
        onCancel={onDismiss}
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
      >
        <UserIncomeField
          form="annualIncome"
          name={setIncomeFieldName(workType)}
          initialValues={{
            estimated1099Income,
            estimatedW2Income,
          }}
          labelType={workType === 'WORK_TYPE_DIVERSIFIED' ? 'W2' : undefined}
          hideTooltip
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

export default connect(
  state => ({
    formValues: getFormValues('annualIncome')(state),
  }),
  { ...toastActions },
)(AdjustableAnnualIncome);
