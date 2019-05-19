import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View, Text } from 'react-native';

import {
  Text as BoldText,
  withDimensions,
  Spinner,
  styles,
} from '@catch/rio-ui-kit';

import { EditInfoLayout, TaxRateSplitCard } from '../components';
import { CalculateTaxes, UpdateTaxGoal } from '../containers';

const PREFIX = 'catch.module.me.AdjustTaxesView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: values => <FormattedMessage id={`${PREFIX}.p1`} values={values} />,
  emphasis: <FormattedMessage id={`${PREFIX}.emphasis`} />,
  dependentsEmphasis: <FormattedMessage id={`${PREFIX}.dependentsEmphasis`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
};

export const AdjustTaxesView = ({
  onCompleted,
  onCancel,
  breakpoints,
  dependents,
}) => (
  <CalculateTaxes>
    {({
      currentPaycheckPercentage,
      reccPaycheckPercentage,
      currentMonthlyContribution,
      reccMonthlyContribution,
      loading,
    }) => (
      <UpdateTaxGoal
        onCompleted={() => onCompleted({ rate: reccPaycheckPercentage })}
      >
        {({ upsertTaxGoal, saving }) => (
          <EditInfoLayout
            onClose={onCancel}
            breakpoints={breakpoints}
            actions={[
              {
                text: COPY['cancelButton'],
                onPress: onCancel,
              },
              {
                text: COPY['submitButton'],
                disabled: saving,
                onPress: () =>
                  upsertTaxGoal({
                    variables: {
                      input: {
                        paycheckPercentage: reccPaycheckPercentage,
                      },
                    },
                  }),
              },
            ]}
          >
            <View style={styles.get(['LgBottomGutter', 'TopGutter'])}>
              <Text
                style={styles.get(['H3', 'BottomGutter'], breakpoints.current)}
              >
                {COPY['title']}
              </Text>
              <Text
                style={styles.get(
                  ['Body', 'BottomGutter'],
                  breakpoints.current,
                )}
              >
                {COPY['p1']({
                  emphasis: (
                    <BoldText weight="bold">
                      {dependents
                        ? COPY['dependentsEmphasis']
                        : COPY['emphasis']}
                    </BoldText>
                  ),
                })}
              </Text>
            </View>
            {loading ? (
              <View
                style={styles.get([
                  'Container',
                  'TopSpace',
                  'BottomSpace',
                  'CenterColumn',
                ])}
              >
                <Spinner large />
              </View>
            ) : (
              <TaxRateSplitCard
                currentRate={currentPaycheckPercentage}
                currentEstimate={currentMonthlyContribution}
                suggestedRate={reccPaycheckPercentage}
                suggestedEstimate={reccMonthlyContribution}
              />
            )}
          </EditInfoLayout>
        )}
      </UpdateTaxGoal>
    )}
  </CalculateTaxes>
);

AdjustTaxesView.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  breakpoints: PropTypes.object.isRequired,
};

const Component = withDimensions(AdjustTaxesView);

Component.displayName = 'AdjustTaxesView';
export default Component;
