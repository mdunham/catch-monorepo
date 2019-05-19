import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { Dropdown, ReduxInput, Box } from '@catch/rio-ui-kit';
import { stateItems } from '@catch/utils';

const PREFIX = 'catch.user.LegalAddressField';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
};

export const LegalAddressField = ({
  intl: { formatMessage },
  white,
  onEnter,
  focused,
  alert,
  isMobile,
}) => (
  <React.Fragment>
    <Field
      name="street1"
      qaName="street1"
      component={ReduxInput}
      placeholder={formatMessage({ id: `${PREFIX}.street1.placeholder` })}
      label={COPY['label']}
      grouped
      white={white}
      alert={alert}
      confirmable={false}
    />

    <Field
      name="street2"
      qaName="street2"
      component={ReduxInput}
      placeholder={formatMessage({ id: `${PREFIX}.street2.placeholder` })}
      grouped
      white={white}
      alert={alert}
      confirmable={false}
    />

    <Field
      name="city"
      qaName="city"
      component={ReduxInput}
      placeholder={formatMessage({ id: `${PREFIX}.city.placeholder` })}
      grouped
      white={white}
      alert={alert}
      confirmable={false}
    />

    <Box row justify="space-between" align="center">
      <Box w={2 / 3} pr={1}>
        <Field
          id="state"
          name="state"
          qaName="state"
          component={Dropdown}
          items={stateItems}
          placeholder={formatMessage({ id: `${PREFIX}.state.placeholder` })}
          autocomplete
          white={white}
          alert={alert}
          confirmable={false}
        />
      </Box>

      <Box w={1 / 3}>
        <Field
          name="zip"
          qaName="zip"
          component={ReduxInput}
          placeholder={formatMessage({ id: `${PREFIX}.zip.placeholder` })}
          white={white}
          alert={alert}
          confirmable={false}
        />
      </Box>
    </Box>
  </React.Fragment>
);

LegalAddressField.defaultProps = {
  focused: false,
  isMobile: false,
};

const withReduxForm = reduxForm({
  enableReinitialize: true,
});

const enhance = compose(
  injectIntl,
  withReduxForm,
);

export default enhance(LegalAddressField);
