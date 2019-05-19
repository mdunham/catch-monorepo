import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { ReduxToggleSwitch, styles, Icon, colors } from '@catch/rio-ui-kit';

const PREFIX = 'catch.TaxDependentField';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
  moreInfo: <FormattedMessage id={`${PREFIX}.moreInfo`} />,
};

function handleInfo() {
  Linking.openURL(
    'https://help.catch.co/setting-up-tax-withholding/who-qualifies-as-a-dependent',
  );
}

export const TaxDependentField = ({ breakpoints, form }) => (
  <React.Fragment>
    <View style={styles.get('Bilateral')}>
      <View style={styles.get(['CenterLeftRow'])}>
        <Field
          form={form}
          name="isTaxDependent"
          qaName="isTaxDependent"
          component={ReduxToggleSwitch}
        />
        <Text style={styles.get(['Body', 'SmLeftGutter'], breakpoints.current)}>
          {COPY['label']}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleInfo}
        style={styles.get('CenterRightRow')}
      >
        <Text
          style={styles.get(['BodyLink', 'SmRightGutter'], breakpoints.current)}
        >
          {COPY['moreInfo']}
        </Text>
        <Icon
          stroke={colors.flare}
          fill={colors.flare}
          dynamicRules={{ paths: { fill: colors.flare } }}
          size={12}
          name="new-window"
        />
      </TouchableOpacity>
    </View>
  </React.Fragment>
);

TaxDependentField.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  form: PropTypes.string,
};

const withReduxForm = reduxForm();

const Component = withReduxForm(TaxDependentField);
Component.displayName = 'TaxDependentField';

export default Component;
