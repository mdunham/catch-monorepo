import React from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableOpacity } from 'react-native';
import { FormattedMessage } from 'react-intl';
import {
  withHover,
  Box,
  colors,
  Label,
  Text,
  Icon,
  borderRadius,
  styles,
} from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.me.InfoBlock';
export const COPY = {
  addButton: <FormattedMessage id={`${PREFIX}.addButton`} />,
};

export class InfoBlock extends React.PureComponent {
  static propTypes = {
    editable: PropTypes.bool,
    onEdit: PropTypes.func,
    info: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.object,
    ]),
    label: PropTypes.object,
    tooltip: PropTypes.node,
    isHovered: PropTypes.bool,
  };
  render() {
    const {
      editable,
      onEdit,
      info,
      label,
      tooltip,
      isLast,
      breakpoints,
      ...other
    } = this.props;
    const isHovered = Boolean(editable && info && other.isHovered);
    return (
      <TouchableOpacity
        disabled={!editable || !info}
        onPress={onEdit}
        style={breakpoints.select({
          'PhoneOnly|TabletPortraitUp': isLast
            ? undefined
            : styles.get('Divider'),
        })}
      >
        <Box
          row
          py={10}
          pl={breakpoints.select({
            TabletLandscapeUp: 12,
          })}
          pr={2}
          align="center"
          justify="space-between"
          style={
            isHovered
              ? {
                  backgroundColor: colors['sage+1'],
                  borderRadius: borderRadius.regular,
                }
              : undefined
          }
        >
          <Box>
            <Box row mb={4.1}>
              {label && <Label mr={2}>{label}</Label>}
              {tooltip}
            </Box>
            {info ? (
              typeof info === 'function' ? (
                info()
              ) : (
                <Text size={16}>{info}</Text>
              )
            ) : (
              <TouchableOpacity onPress={onEdit}>
                <Text color="link" weight="medium">
                  {COPY['addButton']}
                </Text>
              </TouchableOpacity>
            )}
          </Box>
          {breakpoints.select({
            TabletLandscapeUp: isHovered && (
              <Icon name="pencil" size={16} fill={colors.ink} />
            ),
            'PhoneOnly|TabletPortraitUp': editable && (
              <Icon
                name="right"
                fill={colors.ink}
                dynamicRules={{ paths: { fill: colors.ink } }}
              />
            ),
          })}
        </Box>
      </TouchableOpacity>
    );
  }
}

export default withHover(InfoBlock);
