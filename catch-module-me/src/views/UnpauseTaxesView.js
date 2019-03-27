import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, withDimensions, styles, colors } from '@catch/rio-ui-kit';
import { ToggleGoal, EditInfoLayout } from '@catch/common';

const PREFIX = 'catch.module.me.UnpauseTaxesView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: <FormattedMessage id={`${PREFIX}.p1`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
};

export const UnpauseTaxesView = ({ onCancel, onCompleted, breakpoints }) => (
  <ToggleGoal
    goalType="tax"
    goalName="Taxes"
    onCompleted={onCompleted}
    currentStatus="ACTIVE"
  >
    {({ toggleGoal, loading }) => (
      <EditInfoLayout
        center
        onClose={onCancel}
        breakpoints={breakpoints}
        actions={[
          { text: COPY['cancelButton'], onPress: onCancel },
          {
            text: COPY['submitButton'],
            disabled: loading,
            onPress: () =>
              toggleGoal({
                variables: {
                  input: {
                    status: 'ACTIVE',
                  },
                },
              }),
          },
        ]}
      >
        <View style={styles.get('CenterColumn')}>
          <View style={styles.get(['LgBottomGutter', 'TopGutter'])}>
            <Icon
              name="tax"
              fill="black"
              dynamicRules={{ paths: { fill: colors.black } }}
              size={48}
            />
            <Icon name="circle-plus" style={localStyles.icon} />
          </View>
          <Text
            style={styles.get(
              ['H3', 'CenterText', 'BottomGutter'],
              breakpoints.current,
            )}
          >
            {COPY['title']}
          </Text>
          <Text
            style={styles.get(
              ['Body', 'CenterText', 'BottomGutter'],
              breakpoints.current,
            )}
          >
            {COPY['p1']}
          </Text>
        </View>
      </EditInfoLayout>
    )}
  </ToggleGoal>
);

const localStyles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 0,
    right: -12,
  },
});

UnpauseTaxesView.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  breakpoints: PropTypes.object.isRequired,
};

export default withDimensions(UnpauseTaxesView);
