import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import Box from '../Box';
import { H1, H2, H3 } from '../Headings';
import { colors } from '../../const';
import styles from '../../styles';

const PageTitle = ({
  title,
  subtitle,
  subtitles,
  light,
  large,
  small,
  center,
  children,
  defocus,
  viewport,
  isMobile,
  ...other
}) => (
  <Box mb={isMobile ? 1 : 4} mt={1} {...other}>
    {large ? (
      <Text
        style={styles.get(
          ['H1S', !isMobile && 'LgTopGutter', 'BottomGutter'],
          viewport,
        )}
      >
        {title}
      </Text>
    ) : light ? (
      <Text style={styles.get(['H2S', 'BottomGutter'], viewport)}>{title}</Text>
    ) : small ? (
      <Text style={styles.get(['H3S', 'BottomGutter'], viewport)}>{title}</Text>
    ) : (
      <Text style={styles.get(['H2', 'BottomGutter'], viewport)}>{title}</Text>
    )}
    {!!subtitle && (
      <Text
        style={styles.get(
          large
            ? ['H4', 'Regular', 'BottomGutter', center && 'CenterText']
            : ['Body', 'BottomGutter', center && 'CenterText'],
          viewport,
        )}
      >
        {subtitle}
      </Text>
    )}
    {children}
  </Box>
);

PageTitle.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  light: PropTypes.bool,
  isMobile: PropTypes.bool,
  subtitles: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ),
};

export default PageTitle;
