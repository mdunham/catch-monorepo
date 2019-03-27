/**
 * HandleContactView
 *
 * for creating and updating a contact
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { colors, styles, Icon } from '@catch/rio-ui-kit';

import { ContactForm, PlanConnectionsForm } from '../forms';

const S = StyleSheet.create({
  delete: {
    fontWeight: '500',
    color: colors.danger,
  },
});

export const HandleContactView = ({
  breakpoints,
  hasTaxGoal,
  hasRetirementGoal,
  hasTrustedContact,
  isTrustedContact,
  formValues,
  initialValues,
  onDelete,
}) => {
  isTrustedContact =
    isTrustedContact || (!!formValues && formValues.isTrustedContact);

  const showPlanConnections =
    isTrustedContact || hasTaxGoal || (hasRetirementGoal && !hasTrustedContact);

  return (
    <View>
      {showPlanConnections && (
        <View style={styles.get('LgBottomGutter')}>
          <Text
            style={styles.get(
              ['FieldLabel', 'BottomGutter'],
              breakpoints.current,
            )}
          >
            Plan connection
          </Text>
          <PlanConnectionsForm
            form="ContactForm"
            initialValues={initialValues}
            hasTaxGoal={hasTaxGoal}
            hasRetirementGoal={hasRetirementGoal}
            hasTrustedContact={hasTrustedContact}
            isTrustedContact={isTrustedContact}
          />
        </View>
      )}
      <ContactForm
        breakpoints={breakpoints}
        isTrustedContact={isTrustedContact}
        initialValues={initialValues}
      />
      {onDelete && (
        <TouchableOpacity
          style={styles.get('CenterLeftRow')}
          onPress={onDelete}
        >
          <Icon
            name="trash"
            size={16}
            fill={colors.danger}
            dynamicRule={{ paths: { fill: colors.danger } }}
          />
          <Text
            style={styles.get(
              ['Body', 'SmLeftGutter', S.delete],
              breakpoints.current,
            )}
          >
            Delete contact
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HandleContactView;
