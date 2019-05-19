import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, Linking } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { Box, Text, H3, H6, Link, styles } from '@catch/rio-ui-kit';
import { goTo } from '@catch/utils';

import disclosureSections from './disclosureSections';

const PREFIX = 'catch.module.disclosures.DisclosuresView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
};

const textProps = {
  height: 18,
  weight: 'medium',
  color: 'link',
  size: 'small',
};

class DisclosuresList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleDocument = url => {
    this.goTo('/disclosures/container', { disclosure: url });
  };
  render() {
    return (
      <View style={styles.get('ContentMax')}>
        {disclosureSections.map((vendor, i) => (
          <Box mb={4} key={i}>
            <Box pb={2}>
              <H3>{vendor.title}</H3>
              <Text size="nav">{vendor.name}</Text>
            </Box>
            <Box pb={1}>
              <Text size="small" color="ink+1">
                {vendor.subtitle}
              </Text>
            </Box>
            <Box my={1}>
              {vendor.documents.map((disc, j) =>
                Platform.select({
                  web: (
                    <Link
                      key={j}
                      to={
                        disc.url[0] === 'h'
                          ? disc.url
                          : `/disclosures/${disc.url}`
                      }
                      newTab={disc.url[0] === 'h'}
                    >
                      <Text {...textProps}>{disc.title}</Text>
                    </Link>
                  ),
                  default: (
                    <Text
                      onClick={() => this.handleDocument(disc.url)}
                      {...textProps}
                    >
                      {disc.title}
                    </Text>
                  ),
                }),
              )}
            </Box>
          </Box>
        ))}
      </View>
    );
  }
}

export default DisclosuresList;
