import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, withDimensions, styles, colors } from '@catch/rio-ui-kit';
import { ToggleGoal, EditInfoLayout } from '@catch/common';

const PREFIX = 'catch.UnpausePlanView';
export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  'PLANTYPE_TAX.p1': <FormattedMessage id={`${PREFIX}.PLANTYPE_TAX.p1`} />,
  'PLANTYPE_PTO.p1': <FormattedMessage id={`${PREFIX}.PLANTYPE_PTO.p1`} />,
  'PLANTYPE_RETIREMENT.p1': (
    <FormattedMessage id={`${PREFIX}.PLANTYPE_RETIREMENT.p1`} />
  ),
  submitButton: values => (
    <FormattedMessage id={`${PREFIX}.submitButton`} values={values} />
  ),
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
};

const namesMap = {
  PLANTYPE_TAX: {
    icon: 'tax-covered',
    goalType: 'tax',
    name: 'Taxes',
  },
  PLANTYPE_PTO: {
    icon: 'timeoff-covered',
    goalType: 'pto',
    name: 'Time off',
  },
  PLANTYPE_RETIREMENT: {
    icon: 'retirement-covered',
    goalType: 'retirement',
    name: 'Retirement',
  },
};

export const UnpausePlanView = ({
  planType,
  onCancel,
  onCompleted,
  breakpoints,
}) => (
  <ToggleGoal
    goalType={namesMap[planType].goalType}
    goalName={namesMap[planType].name}
    onCompleted={onCompleted}
    currentStatus="ACTIVE"
  >
    {({ toggleGoal, loading }) => (
      <EditInfoLayout
        center
        onClose={onCancel}
        breakpoints={breakpoints}
        actions={[
          { text: COPY['cancelButton'], onPress: onCancel, type: 'outline' },
          {
            text: COPY['submitButton']({ planName: namesMap[planType].name }),
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
            <Icon name={namesMap[planType].icon} size={60} />
          </View>
          <Text
            style={styles.get(
              ['H3', 'CenterText', 'BottomGutter'],
              breakpoints.current,
            )}
          >
            {COPY['title']({ planName: namesMap[planType].name })}
          </Text>
          <Text
            style={styles.get(
              ['Body', 'CenterText', 'BottomGutter'],
              breakpoints.current,
            )}
          >
            {COPY[`${planType}.p1`]}
          </Text>
        </View>
      </EditInfoLayout>
    )}
  </ToggleGoal>
);

UnpausePlanView.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  breakpoints: PropTypes.object.isRequired,
};

const Component = withDimensions(UnpausePlanView);

Component.displayName = 'UnpausePlanView';

export default Component;
