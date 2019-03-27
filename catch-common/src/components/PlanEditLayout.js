import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';

import { Button, styles, withDimensions } from '@catch/rio-ui-kit';

import FlowBar from './FlowBar';

export const PlanEditLayout = ({
  planTitle,
  planIcon,
  breakpoints,
  onSave,
  onCancel,
  children,
}) => (
  <View style={styles.get('Flex1')}>
    <FlowBar icon={planIcon} title={planTitle} onBack={onCancel} />
    <View style={styles.get('Flex1')}>
      <ScrollView contentContainerStyle={styles.get('CenterColumn')}>
        {children}
      </ScrollView>
    </View>
    <View
      style={styles.get(
        ['Margins', 'BottomActions', 'CenterRow'],
        breakpoints.current,
      )}
    >
      <View style={styles.get(['ContainerRow', 'PageMax'])}>
        {!!onCancel && (
          <View style={styles.get(['CenterLeftRow', 'RightGutter'])}>
            <Button
              wide={breakpoints.select({ PhoneOnly: true })}
              type="light"
              onClick={onCancel}
              viewport={breakpoints.current}
            >
              Cancel
            </Button>
          </View>
        )}
        <View style={styles.get('CenterRightRow')}>
          <Button
            wide={breakpoints.select({ PhoneOnly: true })}
            viewport={breakpoints.current}
            onClick={onSave}
          >
            Save
          </Button>
        </View>
      </View>
    </View>
  </View>
);

PlanEditLayout.propTypes = {
  planTitle: PropTypes.string.isRequired,
  planIcon: PropTypes.string.isRequired,
  breakpoints: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  children: PropTypes.node,
};

const Component = withDimensions(PlanEditLayout);

Component.displayName = 'PlanEditLayout';

export default Component;
