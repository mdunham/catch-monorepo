import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { ReduxInput, InfoTooltip } from '@catch/rio-ui-kit';
import { formatDate } from '@catch/utils';

const PREFIX = 'catch.user.DobField';

export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
  tooltip: <FormattedMessage id={`${PREFIX}.tooltip`} />,
};

export const DobField = ({
  intl: { formatMessage },
  onEnter,
  white,
  alert,
}) => (
  <Field
    white={white}
    name="dob"
    qaName="dob"
    component={ReduxInput}
    placeholder={formatMessage({
      id: `${PREFIX}.placeholder`,
    })}
    label={COPY['label']}
    extraLabel={<InfoTooltip body={COPY['tooltip']} />}
    format={formatDate}
    onSubmit={onEnter}
    alert={alert}
    confirmable={false}
  />
);

const withReduxForm = reduxForm();
const enhance = compose(injectIntl, withReduxForm);
const Component = enhance(DobField);

Component.displayName = 'DobField';

export default Component;
