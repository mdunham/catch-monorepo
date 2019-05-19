import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { reduxForm, Field } from 'redux-form';

import {
  ReduxCheckbox,
  Box,
  Text,
  Divider,
  styles,
  Button,
  Spinner,
  colors,
  Icon,
} from '@catch/rio-ui-kit';
import { Percentage, Currency, FullDate } from '@catch/utils';

import COPY from '../copy';

function format(num) {
  return Math.round(num * 100);
}

export function formatDescription(description) {
  if (description) {
    const index = description.indexOf('for');
    return description.slice(index);
  }
  return '';
}

const descriptions = {
  TAX: COPY['taxDescription'],
  PTO: COPY['ptopDescription'],
  RETIREMENT: COPY['retirementDescription'],
};

/**
 * PaycheckBreakdown is a presentational component focused only on
 * formatting and laying out the data it is passed, it handles responsive
 * layout logic. It is wrapped in a form and when isEditing is toggled will
 * render checkboxes to change the form values.
 */
export const PaycheckBreakdown = ({
  breakpoints,
  contributions,
  paycheckName,
  amount,
  formValues,
  total,
  isEditing,
  onEdit,
  onCancel,
  handleSubmit,
  loading,
  date,
  isW2,
}) => (
  <View
    style={styles.get(
      ['FluidContainer', 'TopSpace', 'LgBottomGutter'],
      breakpoints.current,
    )}
  >
    <View style={styles.get(['Container', 'CenterColumn', 'LgBottomGutter'])}>
      <View style={styles.get('ContentMax')}>
        <Text size={24} weight="bold" mb={1}>
          {COPY['headline']}
        </Text>
        <Text mb={2}>{COPY['subHeadline']}</Text>
        {breakpoints.select({
          'TabletLandscapeUp|TabletPortraitUp': (
            <React.Fragment>
              <View style={styles.get(['CenterLeftRow', 'LgTopGutter'])}>
                <Button
                  type="success"
                  viewport={breakpoints.current}
                  disabled={total === 0}
                  onClick={handleSubmit}
                  loading={loading}
                >
                  {COPY['depositButton']({
                    amount: <Currency>{total}</Currency>,
                  })}
                </Button>
              </View>
              <Text mt={2} weight="medium" color="gray2" onClick={onCancel}>
                {COPY['cancelButton']}
              </Text>
            </React.Fragment>
          ),
        })}
      </View>
    </View>
    <View
      style={styles.get(
        ['Container', 'CenterColumn', 'LgBottomGutter'],
        breakpoints.current,
      )}
    >
      <View style={styles.get(['ContentMax', 'FullWidth'])}>
        <Box mb={3}>
          <Text size="large" weight="bold" color="charcoal" mb={3}>
            {COPY['paycheckLabel']}
          </Text>
          <Text size="tiny" weight="medium" color="gray3">
            {COPY['paycheckDate']({
              date: <FullDate uppercase>{date}</FullDate>,
            })}
          </Text>
          <Box row my={2} justify="space-between">
            <Text>{COPY['paycheckName']}</Text>
            <Text weight="medium">
              <Currency>{amount}</Currency>
            </Text>
          </Box>
        </Box>
        <Box row mb={3} justify="space-between">
          <Text size="large" weight="bold" color="charcoal">
            {COPY['planLabel']}
          </Text>
          {contributions.length > 1 && (
            <Text
              weight="medium"
              color="link"
              onClick={onEdit}
              style={{ opacity: isEditing ? 0.5 : 1 }}
            >
              {COPY['editButton']}
            </Text>
          )}
        </Box>
        {contributions.map((goal, key) => (
          <Box row key={goal.id} pb={2} justify="space-between">
            <Box
              row
              style={{
                opacity: formValues[goal.goalID] ? 1 : 0.5,
                maxWidth: 260,
                overflow: 'hidden',
              }}
            >
              {isEditing && (
                <Box mt={3.5}>
                  <Field name={goal.goalID} component={ReduxCheckbox} />
                </Box>
              )}
              <Text ml={isEditing ? 1 : 0}>
                <Percentage whole>{goal.percentage}</Percentage>{' '}
                {descriptions[goal.type]}
              </Text>
            </Box>
            <Text color="charcoal" weight="medium">
              <Currency>{goal.amount}</Currency>
            </Text>
          </Box>
        ))}

        <Divider mt={2} />

        <Box row my={2} justify="space-between">
          <Text size="large">{COPY['totalSavings']}</Text>
          <Text size="large" weight="bold" color="algae">
            <Currency>{total}</Currency>
          </Text>
        </Box>

        {isW2 && (
          <Box
            row
            align="flex-end"
            p={1}
            px={2}
            style={{
              backgroundColor: colors['charcoal--light6'],
              borderRadius: 19,
            }}
            mt={4}
          >
            <Icon
              size={14}
              name="check"
              fill={colors['charcoal--light2']}
              dynamicRules={{ paths: { fill: colors['charcoal--light2'] } }}
            />
            <Text ml={1} color="charcoal--light1" size={14}>
              Your employer takes taxes from W2 paychecks
            </Text>
          </Box>
        )}
      </View>
    </View>
  </View>
);

PaycheckBreakdown.propTypes = {
  contributions: PropTypes.array,
  paycheckLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  paycheckDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  amount: PropTypes.number,
  planLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  formValues: PropTypes.object,
  editText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onEdit: PropTypes.func,
  totalText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  total: PropTypes.number,
  isEditing: PropTypes.bool,
  // isW2 is used to skip the tax contribution from a w2 paycheck and to display a context flag to provide info to
  // a WORK_TYPE_DIVERSIFIED user why taxes is not included in contributions
  isW2: PropTypes.bool,
};

export default reduxForm({
  form: 'paycheckSettings',
  destroyOnUnmount: false,
  enableReinitialize: true,
})(PaycheckBreakdown);
