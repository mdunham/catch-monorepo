import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { ReduxInput } from '@catch/rio-ui-kit';
import { formatLegalName } from '@catch/utils';

const PREFIX = 'catch.user.LegalFirstNameField';

export const LegalFirstNameField = ({
  intl: { formatMessage },
  white,
  onEnter,
  alert,
}) => (
  <Field
    white={white}
    id="givenName"
    name="givenName"
    qaName="givenName"
    component={ReduxInput}
    label={formatMessage({ id: `${PREFIX}.label` })}
    onSubmit={onEnter}
    format={formatLegalName}
    autoComplete="off"
    autoCorrect={false}
    alert={alert}
    confirmable={false}
  />
);

const withReduxForm = reduxForm();

const enhance = compose(injectIntl, withReduxForm);
const Component = enhance(LegalFirstNameField);

Component.displayName = 'LegalFirstNameField';

export default Component;
