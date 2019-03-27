import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { ScrollView, View, Text } from 'react-native';
import {
  PageLayout,
  PageTitle,
  SplitLayout,
  Link,
  withDimensions,
  styles,
  HomeTitle,
} from '@catch/rio-ui-kit';
import DisclosuresList from './DisclosuresList';

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

export class DisclosuresView extends React.PureComponent {
  render() {
    const { viewport, breakpoints } = this.props;
    return (
      <ScrollView contentContainerStyle={styles.get('CenterColumn')}>
        <View
          style={styles.get(
            ['FluidContainer', 'PageWrapper', 'Margins'],
            viewport,
          )}
        >
          <View style={styles.get(['Flex1', 'CenterColumn'])}>
            <PageTitle
              large
              viewport={viewport}
              isMobile={viewport === 'PhoneOnly'}
              title={COPY['title']}
              subtitle={COPY['subtitle']}
            />
          </View>
          <View style={styles.get(['Flex1', 'CenterColumn', 'XlTopGutter'])}>
            <DisclosuresList />
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default withDimensions(DisclosuresView);
