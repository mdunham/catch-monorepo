import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Platform } from 'react-native';

import { H2, Text, Divider, Box, Icon, colors } from '@catch/rio-ui-kit';

import { AccountLimits } from '../components';

const PREFIX = 'catch.module.retirement.AccountSelectionView';
export const COPY = {
  limits: <FormattedMessage id={`${PREFIX}.limits`} />,
  why: <FormattedMessage id={`${PREFIX}.why`} />,
};

export const AccountSelectionDetailView = ({
  description,
  limits,
  label,
  what,
  why,
  showLimits,
  toggleLimits,
  isMobile,
  selectedAccountType,
}) => (
  <React.Fragment>
    <H2 weight="medium" mb={3}>
      {label}
    </H2>
    <Text weight="bold">{what}</Text>
    <Text mt={1}>{description}</Text>
    <Divider my={3} />
    <Box>
      <Text weight="bold">Why this account type?</Text>
      <Text mt={1}>{why}</Text>
    </Box>
    <Divider my={3} />

    <Box row>
      {!isMobile && (
        <Box mt={6}>
          <Icon
            pt={2}
            name="right"
            stroke={colors['charcoal--light1']}
            fill={colors['charcoal--light1']}
            dynamicRules={{
              paths: {
                fill: colors['charcoal--light1'],
              },
            }}
            size={Platform.select({
              web: 10,
              default: 16,
            })}
            style={{
              transform: showLimits ? [{ rotate: '90deg' }] : undefined,
            }}
            onClick={toggleLimits}
          />
        </Box>
      )}
      <Text ml={1} onClick={toggleLimits} weight="bold">
        {COPY['limits']}
      </Text>
    </Box>
    {showLimits && <AccountLimits selectedAccountType={selectedAccountType} />}
  </React.Fragment>
);

AccountSelectionDetailView.propTypes = {
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  showLimits: PropTypes.bool,
  toggleLimits: PropTypes.func.isRequired,
  what: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  why: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

AccountSelectionDetailView.defaultProps = {
  showLimits: false,
};

export default AccountSelectionDetailView;
