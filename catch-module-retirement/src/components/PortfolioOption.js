import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Text,
  Flag,
  Icon,
  OptionCard,
  colors,
  Radio,
  FeatureTooltip,
} from '@catch/rio-ui-kit';
import { Env } from '@catch/utils';

class PortfolioOption extends React.PureComponent {
  static propTypes = {
    isChecked: PropTypes.bool,
    recommended: PropTypes.bool,
    measure: PropTypes.number,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    onChange: PropTypes.func,
    value: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      .isRequired,
    isMobile: PropTypes.bool,
    showDescriptionWhenToggled: PropTypes.bool,
  };

  static defaultProps = {
    showDescriptionWhenToggled: false,
  };

  handleCheck = () => {
    const { onChange, onSelectAccountType, value } = this.props;
    onChange(value);
  };

  render() {
    const {
      isChecked,
      disabled,
      recommended,
      measure,
      label,
      subtitle,
      subtitleCasing,
      onChange,
      stocks,
      bonds,
      value,
      description,
      isMobile,
      viewport,
      tooltip,
      showDescriptionWhenToggled,
      ...rest
    } = this.props;

    return (
      <OptionCard
        checked={isChecked}
        disabled={disabled}
        onClick={() => this.handleCheck()}
        viewport={viewport}
        {...rest}
      >
        {recommended && (
          <Flag type="recommended" mb={1}>
            recommended
          </Flag>
        )}
        <Box row align="center" w={1}>
          <Radio checked={isChecked} onChange={this.handleCheck} value={''} />
          <Box ml={2}>
            <Box row justify="space-between">
              <Text
                size="large"
                weight="medium"
                color={disabled ? colors.gray3 : colors.black}
              >
                {label}
              </Text>
              {isChecked &&
                isMobile && (
                  <Box pr={Env.isNative ? 0 : 4}>
                    <FeatureTooltip>
                      <Box
                        style={{
                          height: '100%',
                          width: '100%',
                          flexGrow: 1,
                        }}
                      >
                        {tooltip}
                      </Box>
                    </FeatureTooltip>
                  </Box>
                )}
            </Box>
            {subtitle && (
              <Text
                textCase={subtitleCasing || 'none'}
                color={disabled ? colors.gray4 : 'charcoal'}
                size={isMobile ? 'small' : undefined}
              >
                {subtitle}
              </Text>
            )}

            {stocks &&
              bonds && (
                <Box row>
                  <Text>
                    {stocks}% stocks
                    <Text weight="bold" color="gray3">
                      {' '}
                      •{' '}
                    </Text>
                    {bonds}% bonds
                  </Text>
                </Box>
              )}
            {isChecked &&
              isMobile &&
              showDescriptionWhenToggled && (
                <Box pt={1} pr={4}>
                  <Text>{description}</Text>
                </Box>
              )}
          </Box>
        </Box>
      </OptionCard>
    );
  }
}

export default PortfolioOption;
