import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Text, View } from 'react-native';

import {
  styles,
  ReduxToggleSwitch,
  Icon,
  Divider,
  colors,
} from '@catch/rio-ui-kit';
import { RELATIONSHIPS } from '@catch/utils';

export const TaxDependentCardField = ({
  id,
  givenName,
  familyName,
  relation,
  isTaxDependent,
  breakpoints,
  hideDivider,
  fakePerson,
}) => (
  <React.Fragment>
    <View style={styles.get(['BottomGutter', 'TopGutter'])}>
      <View style={styles.get(['CenterLeftRow'])}>
        <Field
          id={id}
          name={id}
          component={ReduxToggleSwitch}
          value={isTaxDependent}
        />
        <Icon style={styles.get('LgLeftGutter')} name="person-blob" size={40} />
        <View style={styles.get('LgLeftGutter')}>
          <Text style={styles.get(['Body', 'Bold'], breakpoints.current)}>
            {fakePerson ? 'Unnamed dependent' : `${givenName} ${familyName}`}
          </Text>
          <Text
            style={styles.get(
              ['Body', fakePerson && 'SubtleText'],
              breakpoints.current,
            )}
          >
            {fakePerson ? 'No contact created' : RELATIONSHIPS[relation]}
          </Text>
        </View>
      </View>
    </View>
    {!hideDivider && <Divider color={colors.sage} />}
  </React.Fragment>
);

TaxDependentCardField.propTypes = {
  id: PropTypes.string.isRequired,
  givenName: PropTypes.string,
  familyName: PropTypes.string,
  relation: PropTypes.string,
  isTaxDependent: PropTypes.bool.isRequired,
  breakpoints: PropTypes.object,
  hideDivider: PropTypes.bool,
  fakePerson: PropTypes.bool,
};

const withReduxForm = reduxForm();

const Component = withReduxForm(TaxDependentCardField);
Component.displayName = 'TaxDependentCardField';

export default Component;
