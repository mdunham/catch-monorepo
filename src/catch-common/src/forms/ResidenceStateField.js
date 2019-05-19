import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { Dropdown } from '@catch/rio-ui-kit';
import { stateItems } from '@catch/utils';

const PREFIX = 'catch.user.ResidenceStateField';
export const COPY = {};

export const WorkStateField = ({ white, intl: { formatMessage } }) => (
  <Field
    white={white}
    name="residenceState"
    qaName="residenceState"
    component={Dropdown}
    items={stateItems}
    label="State of residence"
  />
);

const withReduxForm = reduxForm();
const enhance = compose(
  injectIntl,
  withReduxForm,
);
const Component = enhance(WorkStateField);

Component.displayName = 'WorkStateField';

export default Component;
