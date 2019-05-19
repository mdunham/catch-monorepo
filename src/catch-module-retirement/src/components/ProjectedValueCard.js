import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  Text,
  colors,
  borderRadius,
  shadow,
  animations,
  Link,
} from '@catch/rio-ui-kit';

import { formatCurrency } from '@catch/utils';

const PREFIX = 'catch.module.retirement.ProjectedValueCard';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
  description: values => (
    <FormattedMessage id={`${PREFIX}.description`} values={values} />
  ),
};

const styles = StyleSheet.create({
  base: {
    borderColor: colors.gray5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: borderRadius.large,
    backgroundColor: colors.white,
    height: 268,
    ...shadow.card,
    ...animations.fadeInNext,
  },
  header: {
    backgroundColor: colors['charcoal--light4'],
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
  },
  disabled: {
    opacity: 0.3,
  },
});

const ProjectedValueCard = ({
  totalSaved,
  monthlyIncome,
  retirementAge,
  viewport,
}) => (
  <Box py={3} px={3} style={styles.base} my={viewport === 'PhoneOnly' ? 3 : 0}>
    <Box w={4 / 5}>
      <Text size="large">
        {COPY['label']}{' '}
        <Text weight="medium" size="large">
          {formatCurrency(totalSaved.toFixed(2))}
        </Text>
      </Text>
      <Text my={2} color="charcoal--light1" size="small">
        {COPY['description']({
          monthlyIncome: (
            <Text size="small" weight="medium">
              {formatCurrency(monthlyIncome.toFixed(2))}
            </Text>
          ),
          retirementAge,
        })}
      </Text>

      <Link
        to="https://help.catch.co/building-for-retirement/how-do-you-calculate-my-retirement-plans-projected-value"
        newTab
      >
        How is this calculated?
      </Link>
    </Box>
  </Box>
);

ProjectedValueCard.propTypes = {
  totalSaved: PropTypes.number.isRequired,
  monthlyIncome: PropTypes.number.isRequired,
  retirementAge: PropTypes.number,
};

ProjectedValueCard.defaultProps = {
  retirementAge: 65,
};

export default ProjectedValueCard;
