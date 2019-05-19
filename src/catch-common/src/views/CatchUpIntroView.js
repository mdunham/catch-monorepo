import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Text,
  Blob,
  styles,
  Button,
  Box,
  Link,
  Figure,
} from '@catch/rio-ui-kit';

const PREFIX = 'catch.utils.CatchUpIntroView';
export const COPY = {
  TAX: {
    header: 'TAX WITHHOLDING',
    title: 'Catching up on taxes',
    description:
      'Move forward with confidence by catching up on taxes you may already owe this quarter.',
    helper: 'What are quarterly taxes?',
    helperUrl:
      'https://help.catch.co/setting-up-tax-withholding/what-are-quarterly-taxes',
  },
  PTO: {
    header: 'TIME OFF',
    title: 'Make any weekend a long weekend',
    description:
      'Stash a little money away for a guilt-free day off from work. We both know you deserve it.',
  },
  RETIREMENT: {
    header: 'RETIREMENT',
    title: 'Start funding your future',
    description:
      'Kick start your retirement savings by submitting your first deposit today.',
  },
};

const icons = {
  TAX: 'starter-block',
  PTO: 't-shirt',
  RETIREMENT: 'rocket-ship',
};

const CatchUpIntroView = ({
  breakpoints,
  goalType,
  onNext,
  onDismiss,
  viewport,
}) => (
  <View style={styles.get(['Flex1'])}>
    <View style={styles.get('CenterColumn')}>
      <View>
        <Figure name={icons[goalType]} />
      </View>
      <Text mt={2} size="tiny" weight="medium">
        {COPY[goalType]['header']}
      </Text>
      <Text
        style={styles.get('CenterText')}
        weight="medium"
        mt={1}
        mb={2}
        mx={3}
        size={24}
      >
        {COPY[goalType]['title']}
      </Text>
      <View style={styles.get('ContentMax')}>
        <Text
          style={styles.get(['CenterText'])}
          px={breakpoints.current === 'PhoneOnly' ? 2 : 4}
          mb={1}
        >
          {COPY[goalType]['description']}
        </Text>
      </View>
      {COPY[goalType]['helper'] && (
        <Link newTab to={COPY[goalType]['helperUrl']}>
          {COPY[goalType]['helper']}
        </Link>
      )}
      {viewport !== 'PhoneOnly' && (
        <Box mt={4} mb={4} row>
          <Box mr={2}>
            <Button
              viewport={breakpoints.current}
              onClick={onDismiss}
              type="outline"
            >
              No thanks
            </Button>
          </Box>

          <Button viewport={breakpoints.current} onClick={onNext}>
            Let's go
          </Button>
        </Box>
      )}
    </View>
    {viewport === 'PhoneOnly' && (
      <View
        style={styles.get(
          ['BottomBar', 'Margins', 'ContainerRow'],
          breakpoints.current,
        )}
      >
        <View
          style={styles.get([
            breakpoints.select({ PhoneOnly: 'Flex1' }),
            'CenterRow',
            'FullWidth',
            'RightGutter',
          ])}
        >
          <Button
            wide={breakpoints.select({ PhoneOnly: true })}
            onClick={onDismiss}
            type="outline"
          >
            No thanks
          </Button>
        </View>
        <View
          style={styles.get([
            breakpoints.select({ PhoneOnly: 'Flex1' }),
            'CenterRow',
            'FullWidth',
          ])}
        >
          <Button
            wide={breakpoints.select({ PhoneOnly: true })}
            onClick={onNext}
          >
            Let's go
          </Button>
        </View>
      </View>
    )}
  </View>
);

CatchUpIntroView.propTypes = {
  goalType: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

const localStyles = StyleSheet.create({
  blob: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default CatchUpIntroView;
