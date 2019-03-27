import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Platform, Image, StyleSheet } from 'react-native';

import {
  Hoverable,
  withHover,
  Divider,
  Icon,
  colors,
  borderRadius,
  Button,
  Text,
  Box,
  Flex,
} from '@catch/rio-ui-kit';

const base = {
  padding: 20,
  borderWidth: 1,
  borderColor: colors.gray5,
  borderRadius: borderRadius.regular,
  ...Platform.select({
    web: {
      cursor: 'pointer',
    },
  }),
};

const iconStyle = {
  height: 28,
  width: 28,
  marginTop: 6,
};

const styles = StyleSheet.create({
  icon: {
    borderColor: 'black',
    borderWidth: 0.5,
    height: 28,
    width: 28,
    resizeMode: 'cover',
  },
});

/**
 * PlanPlaceholder is a temporary card used to show game plans
 */
export const PlanPlaceholder = ({
  title,
  subtitle,
  status,
  onClick,
  action,
  raised,
  noImage,
  icon,
  qaName,
  isHovered,
  ...other
}) => (
  <TouchableOpacity onPress={onClick} accessibilityLabel={qaName}>
    <Box
      mb={3}
      style={[base, isHovered && { borderColor: colors.gray4 }]}
      {...other}
    >
      <Flex row wrap align="center">
        {!noImage && (
          <Box mr={2}>
            <Icon
              name={icon}
              fill="black"
              dynamicRules={{ paths: { fill: colors.black } }}
              style={iconStyle}
            />
          </Box>
        )}

        <Box auto justify="space-between">
          <Text
            size={11}
            height={17}
            weight="bold"
            textCase="uppercase"
            spacing={1}
            color="secondary"
          >
            {status}
          </Text>
          <Text size={17} weight="medium">
            {title}
          </Text>
        </Box>
      </Flex>
      {!!subtitle && (
        <Box mt={2}>
          <Divider />
          <Box pr={3} pt={2}>
            <Text color="gray3" size="small">
              {subtitle}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  </TouchableOpacity>
);

PlanPlaceholder.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
  onClick: PropTypes.func.isRequired,
  raised: PropTypes.bool,
  isHovered: PropTypes.bool,
};

export default withHover(PlanPlaceholder);
