import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Platform, View, Text } from 'react-native';
import {
  Icon,
  colors,
  Button,
  withDimensions,
  styles,
} from '@catch/rio-ui-kit';

import SyncHeader from './SyncHeader';
import { bankColorNames } from '../const';

const PREFIX = 'catch.module.link-bank.DefaultError';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: <FormattedMessage id={`${PREFIX}.p1`} />,
  p2: values => <FormattedMessage id={`${PREFIX}.p2`} values={values} />,
  cspLink: <FormattedMessage id={`${PREFIX}.cspLink`} />,
  button: <FormattedMessage id={`${PREFIX}.button`} />,
};

const DefaultError = ({ bankName, onRetry, breakpoints, onBack }) => (
  <View style={styles.get(['Container', 'ModalMax'])}>
    <View style={styles.get(['Margins'], breakpoints.current)}>
      {Platform.OS === 'web' &&
        breakpoints.select({
          PhoneOnly: (
            <View
              style={styles.get(['RowContainer', 'TopGutter', 'BottomGutter'])}
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
      <SyncHeader
        title={COPY['title']}
        subtitle={COPY['p1']}
        iconName={bankColorNames[bankName]}
        viewport={breakpoints.current}
      />
      <Text style={styles.get(['BottomGutter', 'Body'], breakpoints.current)}>
        {COPY['p2']({
          cspLink: (
            <Text
              style={styles.get('BodyLink', breakpoints.current)}
              onPress={
                window && window.Intercom
                  ? () => window.Intercom('show')
                  : undefined
              }
            >
              {COPY['cspLink']}
            </Text>
          ),
        })}
      </Text>
    </View>
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
          {COPY['button']}
        </Button>
      </View>
    </View>
  </View>
);

DefaultError.propTypes = {
  bankName: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
  breakpoints: PropTypes.object.isRequired,
};

export default DefaultError;
