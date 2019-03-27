import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View, ScrollView, Platform, Text } from 'react-native';
import {
  Spinner,
  Icon,
  colors,
  Button,
  SplitLayout,
  styles,
} from '@catch/rio-ui-kit';

import { DefaultError } from '../../components';

const PREFIX = 'catch.module.link-bank.ConfigChallenge';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: values => (
    <FormattedMessage id={`${PREFIX}.description`} values={values} />
  ),
  retryButton: <FormattedMessage id={`${PREFIX}.retryButton`} />,
  helpLink: <FormattedMessage id={`${PREFIX}.helpLink`} />,
  bankInfoTitle: values => (
    <FormattedMessage id={`${PREFIX}.bankInfoTitle`} values={values} />
  ),
  bankInfoButton: <FormattedMessage id={`${PREFIX}.bankInfoButton`} />,
};

const borderLeft = {
  borderLeftWidth: 1,
  borderLeftColor: colors.gray5,
  height: '100%',
};

// If for whatever reason there are no instructions we render a different component
const ConfigChallenge = ({
  bankName,
  instructions,
  onRetry,
  onBack,
  breakpoints,
  loading,
}) =>
  instructions ? (
    breakpoints.select({
      PhoneOnly: (
        <View style={styles.get(['Container', 'FullWidth', 'BottomSpace'])}>
          {Platform.OS === 'web' &&
            breakpoints.select({
              PhoneOnly: (
                <View
                  style={styles.get([
                    'RowContainer',
                    'TopGutter',
                    'SmMargins',
                    'BottomGutter',
                  ])}
                >
                  <Icon
                    name="right"
                    onClick={onBack}
                    fill={colors.primary}
                    stroke={colors.primary}
                    dynamicRules={{ paths: { fill: colors.primary } }}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </View>
              ),
            })}
          <ScrollView
            contentContainerStyle={styles.get(
              ['Margins', 'Container'],
              breakpoints.current,
            )}
          >
            <Text
              style={styles.get(
                ['H3', 'BottomGutter', 'TopGutter'],
                breakpoints.current,
              )}
            >
              {COPY['title']}
            </Text>
            <Text
              style={styles.get(
                ['Body', 'LgBottomGutter'],
                breakpoints.current,
              )}
            >
              {COPY['description']({ bankName })}
            </Text>
            <Text
              style={styles.get(['H4', 'BottomGutter'], breakpoints.current)}
            >
              {COPY['bankInfoTitle']({ bankName })}
            </Text>
            {loading ? (
              <View style={styles.get('CenterColumn')}>
                <Spinner />
              </View>
            ) : (
              <Text
                style={styles.get(
                  ['Body', 'LgBottomGutter'],
                  breakpoints.current,
                )}
              >
                {instructions}
              </Text>
            )}
          </ScrollView>
          <View
            style={styles.get(
              ['BottomBar', 'Margins', 'ContainerRow'],
              breakpoints.current,
            )}
          >
            <View style={styles.get('CenterRightRow')}>
              <Button
                onClick={onRetry}
                wide={breakpoints.select({ PhoneOnly: true })}
              >
                {COPY['retryButton']}
              </Button>
            </View>
          </View>
        </View>
      ),
      'TabletPortraitUp|TabletLandscapeUp': (
        <View
          style={styles.get(
            ['ContainerRow', 'Margins', 'SmTopSpace', 'SmBottomSpace'],
            breakpoints.current,
          )}
        >
          <View style={styles.get(['Container', 'ContentMax'])}>
            <Text
              style={styles.get(['H3', 'BottomGutter'], breakpoints.current)}
            >
              {COPY['title']}
            </Text>
            <Text
              style={styles.get(
                ['Body', 'LgBottomGutter'],
                breakpoints.current,
              )}
            >
              {COPY['description']({ bankName })}
            </Text>
            <View>
              <Button onClick={onRetry}>{COPY['retryButton']}</Button>
            </View>
            <Text
              style={styles.get(['BodyLink', 'TopGutter'], breakpoints.current)}
            >
              {COPY['helpLink']}
            </Text>
          </View>
          <View style={styles.get(['Container', 'ContentMax', 'LeftGutter'])}>
            <Text
              style={styles.get(['H4', 'BottomGutter'], breakpoints.current)}
            >
              {COPY['bankInfoTitle']({ bankName })}
            </Text>
            {loading ? (
              <View style={styles.get('CenterColumn')}>
                <Spinner />
              </View>
            ) : (
              <Text
                style={styles.get(
                  ['Body', 'LgBottomGutter'],
                  breakpoints.current,
                )}
              >
                {instructions}
              </Text>
            )}
          </View>
        </View>
      ),
    })
  ) : (
    <DefaultError
      bankName={bankName}
      onRetry={onRetry}
      breakpoints={breakpoints}
    />
  );

ConfigChallenge.propTypes = {
  instructions: PropTypes.string,
  bankName: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};
export default ConfigChallenge;
