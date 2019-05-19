import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  colors,
  Box,
  Text,
  Icon,
  withDimensions,
  Divider,
  Link,
} from '@catch/rio-ui-kit';

import FolioClient from './FolioClient';

const PREFIX = 'catch.module.retirement.FolioFooter';
export const COPY = {
  catchText: <FormattedMessage id={`${PREFIX}.catchText`} />,
  folioText: <FormattedMessage id={`${PREFIX}.folioText`} />,
};

const styles = StyleSheet.create({
  base: {
    // The fog on Figma is actually mist here...
    backgroundColor: colors.mist,
    zIndex: -1,
    width: '100%',
  },
  border: {
    borderRightWidth: 1,
    borderColor: colors['ink+3'],
    height: 40,
  },
  catchLogo: {
    marginBottom: 24,
  },
});

export class FolioFooter extends React.PureComponent {
  handleLink = () => {
    if (window) {
      window.open('https://help.catch.co/building-for-retirement/folios-faq');
    }
    // @TODO fix for native
  };
  render() {
    const { viewport } = this.props;
    const isMobile = viewport === 'PhoneOnly';

    return isMobile ? (
      <Box align="center" style={styles.base} pb={125} pt={3}>
        <Text size={12} mb={1}>
          {COPY['catchText']}
        </Text>
        <Icon
          fill={colors.ink}
          dynamicRules={{ paths: { fill: colors.ink } }}
          name="full-logo"
          height={21}
          width={74}
          style={styles.catchLogo}
        />
        <Divider short />
        <Text size={12} mt={3} mb={1}>
          {COPY['folioText']}
        </Text>
        <FolioClient />
      </Box>
    ) : (
      <Box pt={5} pb={125} style={styles.base} align="center">
        <Box row>
          <Box align="center" mx={5} my={0}>
            <Text mb={-24}>{COPY['catchText']}</Text>
            <Icon fill={colors.ink} name="full-logo" size={90} />
          </Box>
          <Box mt={2} style={styles.border} />
          <Box align="center" mx={5}>
            <Text mb={1}>{COPY['folioText']}</Text>
            <FolioClient onClick={this.handleLink} />
          </Box>
        </Box>
      </Box>
    );
  }
}

FolioFooter.propTypes = {
  viewport: PropTypes.string.isRequired,
};

const Component = withDimensions(FolioFooter);

Component.displayName = 'FolioFooter';

export default Component;
