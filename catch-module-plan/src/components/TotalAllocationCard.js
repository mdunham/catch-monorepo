import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Flex,
  List,
  ListItem,
  Text,
  shadow,
  colors,
  borderRadius,
} from '@catch/rio-ui-kit';
import { Percentage } from '@catch/utils';

const styles = {
  base: {
    ...shadow.deep,
    borderRadius: borderRadius.regular,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  header: {},
};

const TotalAllocationCard = ({
  percentages: {
    ptoPercentages,
    retirementPercentage,
    taxPercentage,
    totalPercentage,
  },
}) => {
  return (
    <Flex style={styles.base}>
      <Box p={3}>
        {!!taxPercentage && (
          <Box pb={1}>
            <Text weight="medium">
              <Percentage whole>{taxPercentage}</Percentage> Taxes
            </Text>
          </Box>
        )}
        {!!ptoPercentages && (
          <Box>
            <Box pb={1}>
              <Text weight="medium">
                <Percentage whole>
                  {ptoPercentages.plannedPaycheckPercentage}
                </Percentage>{' '}
                Planned Time Off
              </Text>
            </Box>
            <Box pb={1}>
              <Text weight="medium">
                <Percentage whole>
                  {ptoPercentages.unplannedPaycheckPercentage}
                </Percentage>{' '}
                Unplanned Time Off
              </Text>
            </Box>
          </Box>
        )}
        {!!retirementPercentage && (
          <Box pb={1}>
            <Text weight="medium">
              <Percentage whole>{retirementPercentage}</Percentage> Retirement
            </Text>
          </Box>
        )}
        <Box pb={1}>
          <Text weight="medium">Catch will set aside a total of</Text>
          <Text weight="medium" color="link">
            <Percentage whole>{totalPercentage}</Percentage> per paycheck
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default TotalAllocationCard;
