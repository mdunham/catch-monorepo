import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';

import { Flex, Box, ReduxCheckbox, Checkbox } from '@catch/rio-ui-kit';

const PREFIX = 'catch.util.forms.DisclosuresForm';
export const COPY = {
  isControlPerson: <FormattedMessage id={`${PREFIX}.isControlPerson`} />,
  isFirmAffiliated: <FormattedMessage id={`${PREFIX}.isFirmAffiliated`} />,
  isPoliticallyExposed: (
    <FormattedMessage id={`${PREFIX}.isPoliticallyExposed`} />
  ),
};

class DisclosuresForm extends Component {
  render() {
    return (
      <React.Fragment>
        <Box mb={2}>
          <Field name="isControlPerson" component={ReduxCheckbox}>
            {COPY['isControlPerson']}
          </Field>
        </Box>
        <Box mb={2}>
          <Field name="isFirmAffiliated" component={ReduxCheckbox}>
            {COPY['isFirmAffiliated']}
          </Field>
        </Box>
        <Box mb={2}>
          <Field name="isPoliticallyExposed" component={ReduxCheckbox}>
            {COPY['isPoliticallyExposed']}
          </Field>
        </Box>
      </React.Fragment>
    );
  }
}

const withReduxForm = reduxForm({
  form: 'DisclosuresForm',
  enableReinitialize: true,
});

export default withReduxForm(DisclosuresForm);
