import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View, Text } from 'react-native';
import { compose } from 'redux';

import {
  Text as BoldText,
  withDimensions,
  Spinner,
  styles,
} from '@catch/rio-ui-kit';
import { TaxRateSplitCard, EditInfoLayout } from '@catch/common';
import { UpdateTaxGoal } from '@catch/taxes';
import { Percentage } from '@catch/utils';
import { withToast } from '@catch/errors';

const PREFIX = 'catch.module.me.AdjustTaxesView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: values => <FormattedMessage id={`${PREFIX}.p1`} values={values} />,
  emphasis: <FormattedMessage id={`${PREFIX}.emphasis`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
  'AdjustTaxesToast.title': (
    <FormattedMessage id={`catch.module.me.EditInfo.AdjustTaxesToast.title`} />
  ),
  'AdjustTaxesToast.msg': values => (
    <FormattedMessage
      id={`catch.module.me.EditInfo.AdjustTaxesToast.msg`}
      values={values}
    />
  ),
};

export const AdjustTaxesView = ({
  currentRate,
  currentEstimate,
  suggestedRate,
  suggestedEstimate,
  onCompleted,
  onCancel,
  popToast,
  breakpoints,
}) => (
  <UpdateTaxGoal
    onCompleted={() => {
      popToast({
        type: 'success',
        title: COPY['AdjustTaxesToast.title'],
        msg: COPY['AdjustTaxesToast.msg']({
          rate: <Percentage>{suggestedRate}</Percentage>,
        }),
      });
      onCompleted();
    }}
  >
    {({ upsertTaxGoal, saving }) => (
      <EditInfoLayout
        center
        onClose={onCancel}
        breakpoints={breakpoints}
        actions={[
          {
            text: COPY['cancelButton'],
            onPress: onCancel,
            type: 'outline',
          },
          {
            text: COPY['submitButton'],
            disabled: saving,
            onPress: () =>
              upsertTaxGoal({
                variables: {
                  input: {
                    paycheckPercentage: suggestedRate,
                  },
                },
              }),
          },
        ]}
      >
        <View
          style={styles.get([
            'LgBottomGutter',
            'TopGutter',
            breakpoints.select({
              'TabletLandscapeUp|TabletPortraitUp': 'CenterColumn',
            }),
          ])}
        >
          <Text style={styles.get(['H3', 'BottomGutter'], breakpoints.current)}>
            {COPY['title']}
          </Text>
          <Text
            style={styles.get(
              [
                'Body',
                'BottomGutter',
                breakpoints.select({
                  'TabletLandscapeUp|TabletPortraitUp': 'CenterText',
                }),
              ],
              breakpoints.current,
            )}
          >
            {COPY['p1']({
              emphasis: <BoldText weight="bold">{COPY['emphasis']}</BoldText>,
            })}
          </Text>
        </View>
        <TaxRateSplitCard
          currentRate={currentRate}
          currentEstimate={currentEstimate}
          suggestedRate={suggestedRate}
          suggestedEstimate={suggestedEstimate}
        />
      </EditInfoLayout>
    )}
  </UpdateTaxGoal>
);

AdjustTaxesView.propTypes = {
  currentRate: PropTypes.number,
  currentEstimate: PropTypes.number,
  suggestedRate: PropTypes.number,
  suggestedEstimate: PropTypes.number,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  breakpoints: PropTypes.object.isRequired,
};

const enhance = compose(
  withToast,
  withDimensions,
);

const Component = enhance(AdjustTaxesView);

Component.displayName = 'AdjustTaxesView';
export default Component;
