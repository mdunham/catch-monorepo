import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  withHover,
  Box,
  colors,
  Label,
  Text,
  Icon,
  borderRadius,
} from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.me.InfoBlock';
export const COPY = {
  addButton: <FormattedMessage id={`${PREFIX}.addButton`} />,
};

export const InfoBlockGroup = ({
  editable,
  onEdit,
  data,
  breakpoints,
  ...other
}) => {
  const filteredData = data && data.filter(d => d.info !== null);

  const isHovered = Boolean(editable && data && other.isHovered);

  return (
    <TouchableOpacity disabled={!editable} onPress={onEdit}>
      <Box
        row
        py={10}
        pl={breakpoints.select({
          TabletLandscapeUp: 12,
        })}
        pr={2}
        justify="space-between"
        align="center"
        style={
          isHovered
            ? {
                backgroundColor: colors.ghost,
                borderRadius: borderRadius.regular,
              }
            : undefined
        }
      >
        <Box>
          {filteredData ? (
            filteredData.map((d, index) => (
              <Box py={10} key={`${index}-${d.label}`}>
                <Box row mb={4.1}>
                  {d.label && <Label mr={2}>{d.label}</Label>}
                  {d.tooltip}
                </Box>
                {d.info && <Text size={16}>{d.info}</Text>}
              </Box>
            ))
          ) : (
            <TouchableOpacity onPress={onEdit}>
              <Text color="link" weight="medium">
                {COPY['addButton']}
              </Text>
            </TouchableOpacity>
          )}
        </Box>
        {isHovered && <Icon name="pencil" size={16} fill={colors.ink} />}
      </Box>
    </TouchableOpacity>
  );
};

InfoBlockGroup.propTypes = {
  editable: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  isHovered: PropTypes.bool,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      info: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }),
  ),
};

export default withHover(InfoBlockGroup);
