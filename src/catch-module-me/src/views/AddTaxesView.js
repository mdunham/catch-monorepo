import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, withDimensions, styles, colors } from '@catch/rio-ui-kit';
import { EditInfoLayout } from '@catch/common';

const PREFIX = 'catch.module.me.AddTaxesView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  'p1.1099': <FormattedMessage id={`${PREFIX}.p1.1099`} />,
  'p1.default': <FormattedMessage id={`${PREFIX}.p1.default`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
};

const selectCaption = workType => {
  return workType === 'WORK_TYPE_1099' || workType === 'WORK_TYPE_DIVERSIFIED'
    ? COPY['p1.1099']
    : COPY['p1.default'];
};

export const AddTaxesView = ({
  onCancel,
  onCompleted,
  breakpoints,
  workType,
  goTo,
}) => (
  <EditInfoLayout
    onClose={onCancel}
    breakpoints={breakpoints}
    actions={[
      { text: COPY['cancelButton'], onPress: onCancel },
      {
        text: COPY['submitButton'],
        onPress: () => {
          goTo(['/plan/taxes', '/intro']);
          onCompleted();
        },
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
        {selectCaption(workType)}
      </Text>
    </View>
  </EditInfoLayout>
);

const localStyles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 0,
    right: -12,
  },
});

AddTaxesView.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  breakpoints: PropTypes.object.isRequired,
  workType: PropTypes.string.isRequired,
  goTo: PropTypes.func.isRequired,
};

export default withDimensions(AddTaxesView);
