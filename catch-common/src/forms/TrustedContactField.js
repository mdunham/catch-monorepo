import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { ReduxToggleSwitch, styles, InfoTooltip } from '@catch/rio-ui-kit';

const PREFIX = 'catch.TrustedContactField';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
  tooltip: <FormattedMessage id={`${PREFIX}.tooltip`} />,
};

export const TrustedContactField = ({ breakpoints, form }) => (
  <View style={styles.get('Bilateral')}>
    <View style={styles.get(['CenterLeftRow'])}>
      <Field
        form={form}
        name="isTrustedContact"
        component={ReduxToggleSwitch}
      />
      <Text style={styles.get(['Body', 'SmLeftGutter'], breakpoints.current)}>
        {COPY['label']}
      </Text>
    </View>
    <View>
      <InfoTooltip body={COPY['tooltip']} />
    </View>
  </View>
);

TrustedContactField.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  form: PropTypes.string,
};

const withReduxForm = reduxForm();

const Component = withReduxForm(TrustedContactField);
Component.displayName = 'TrustedContactField';

export default Component;
