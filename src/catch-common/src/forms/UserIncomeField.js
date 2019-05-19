import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { ReduxInput, Icon } from '@catch/rio-ui-kit';
import {
  formatCurrency,
  ensureZero,
  normalizeCurrency,
  Env,
} from '@catch/utils';

const PREFIX = 'catch.user.UserIncomeField';
export const COPY = {
  labels: {
    default: <FormattedMessage id={`${PREFIX}.label`} />,
    '1099': <FormattedMessage id={`${PREFIX}.label1099`} />,
    W2: <FormattedMessage id={`${PREFIX}.labelW2`} />,
  },
  subLabels: {
    '1099': <FormattedMessage id={`${PREFIX}.subLabel1099`} />,
    W2: <FormattedMessage id={`${PREFIX}.subLabelW2`} />,
  },
  // ----------------------------------------------
  // TODO: get specific tooltip copy from design
  // ----------------------------------------------
  info: <FormattedMessage id={`${PREFIX}.tooltip`} />,
};

/**
 * Return appropriate fieldName based on work type if it's mixed
 * we return W2 name and will render 1099 below
 */
export function setIncomeFieldName(workType, fieldName = 'UserIncomeField') {
  if (fieldName === 'UserIncomeField') {
    switch (workType) {
      case 'WORK_TYPE_1099':
        return 'estimated1099Income';
      case 'WORK_TYPE_W2':
        return 'estimatedW2Income';
      case 'WORK_TYPE_DIVERSIFIED':
        return 'estimatedW2Income';
      default:
        return undefined;
    }
  } else {
    return undefined;
  }
}

/**
 * This component can be used for any user income input field.
 * The name can be customized to fit the specific income usage as well
 * as income specific labels and subLabels to provide more information to users,
 * by default the label is 'Estimated annual income' with no subLabel
 */
export const UserIncomeField = ({
  intl: { formatMessage },
  name,
  white,
  onEnter,
  hideTooltip,
  onInfoClick,
  labelType,
}) => (
  <Field
    white={white}
    name={name}
    qaName={name}
    component={ReduxInput}
    format={val => formatCurrency(val)}
    parse={val => ensureZero(normalizeCurrency(val))}
    confirmable={false}
    placeholder={formatMessage({
      id: `${PREFIX}.placeholder`,
    })}
    label={COPY.labels[labelType]}
    subLabel={COPY.subLabels[labelType]}
    extraLabel={
      !hideTooltip && (
        <Icon name="info" fill="none" size={16} onClick={onInfoClick} />
      )
    }
    onSubmit={onEnter}
    keyboardType={Env.isNative ? 'number-pad' : undefined}
  />
);

UserIncomeField.propTypes = {
  name: PropTypes.string,
  white: PropTypes.bool,
  onEnter: PropTypes.func,
  labelType: PropTypes.oneOf(['default', 'W2', '1099']),
};

UserIncomeField.defaultProps = {
  name: 'annualIncome',
  labelType: 'default',
};

const withReduxForm = reduxForm();

const enhance = compose(
  injectIntl,
  withReduxForm,
);

const Component = enhance(UserIncomeField);

Component.displayName = 'UserIncomeField';

export default Component;
