import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Box,
  Link,
  Icon,
  PageLayout,
  Text,
  colors,
  size,
  styles,
  withDimensions,
} from '@catch/rio-ui-kit';
import { createLogger } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import Markdown from './markdown';

const Log = createLogger('disclosure-container');

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(249, 250, 251, .82)',
  },
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
  },
});

export class DisclosureContainer extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      disclosure: '',
      error: null,
    };
  }
  componentWillMount() {
    const {
      match: {
        params: { disclosure },
      },
    } = this.props;

    const disclosurePath = `https://s.catch.co/legal/${disclosure}.md`;
    try {
      fetch(disclosurePath)
        .then(res => res.text())
        .then(text =>
          this.setState({
            disclosure: text,
          }),
        );
    } catch (error) {
      this.setState({
        error,
      });
    }
  }
  render() {
    const { disclosure, error } = this.state;
    const { viewport } = this.props;
    return (
      <ScrollView
        contentContainerStyle={styles.get('CenterColumn')}
        stickyHeaderIndices={[0]}
      >
        <View
          style={styles.get(
            [
              'Margins',
              'PageMax',
              'TopGutter',
              'BottomGutter',
              'FullWidth',
              headerStyles.container,
            ],
            viewport,
          )}
        >
          <Link to="/disclosures" container style={headerStyles.base}>
            <Icon size={16} name="left" fill={colors.primary} />
            <Text color="link" weight="medium" ml={2}>
              All
            </Text>
          </Link>
        </View>
        <View style={styles.get(['Margins', 'PageWrapper'], viewport)}>
          <ErrorBoundary Component={ErrorMessage}>
            {error ? <ErrorMessage /> : <Markdown source={disclosure} />}
          </ErrorBoundary>
        </View>
      </ScrollView>
    );
  }
}

export default withDimensions(DisclosureContainer);
