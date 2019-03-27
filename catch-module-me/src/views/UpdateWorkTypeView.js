import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  withDimensions,
  styles,
  colors,
  Text as Emphasis,
  Blob,
} from '@catch/rio-ui-kit';
import { UpdateWorkType, EditInfoLayout } from '@catch/common';

const PREFIX = 'catch.module.me.UpdateWorkTypeView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: values => <FormattedMessage id={`${PREFIX}.p1`} values={values} />,
  emphasized1099: <FormattedMessage id={`${PREFIX}.emphasized1099`} />,
  emphasizedW2: <FormattedMessage id={`${PREFIX}.emphasizedW2`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
};

const workTypes = {
  WORK_TYPE_1099: {
    shorthand: '1099',
    emphasis: COPY['emphasizedW2'],
    suggestedSwitch: 'WORK_TYPE_W2',
  },
  WORK_TYPE_W2: {
    shorthand: 'W2',
    emphasis: COPY['emphasized1099'],
    suggestedSwitch: 'WORK_TYPE_1099',
  },
};

export const UpdateWorkTypeView = ({
  onCancel,
  onCompleted,
  breakpoints,
  triggerContext,
}) => (
  <UpdateWorkType onCompleted={onCompleted} refetch>
    {({ mutateWorkType, loading }) => (
      <EditInfoLayout
        center
        onClose={onCancel}
        breakpoints={breakpoints}
        actions={[
          { text: COPY['cancelButton'], onPress: onCancel },
          {
            text: COPY['submitButton'],
            onPress: () =>
              mutateWorkType({
                variables: {
                  userWorkTypeInput: {
                    workType:
                      workTypes[triggerContext.nullIncome].suggestedSwitch,
                  },
                },
              }),
            disabled: loading,
          },
        ]}
      >
        <View style={styles.get('CenterColumn')}>
          <View style={styles.get('TopGutter')}>
            <Blob name="suitcase" color="wave" />
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
            {COPY['p1']({
              workType: workTypes[triggerContext.nullIncome].shorthand,
              emphasized: (
                <Emphasis weight="medium">
                  {workTypes[triggerContext.nullIncome].emphasis}
                </Emphasis>
              ),
            })}
          </Text>
        </View>
      </EditInfoLayout>
    )}
  </UpdateWorkType>
);

UpdateWorkTypeView.propTypes = {
  triggerContext: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onCompleted: PropTypes.func,
  breakpoints: PropTypes.object.isRequired,
};

const localStyles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 0,
    right: -12,
  },
});

export default withDimensions(UpdateWorkTypeView);
