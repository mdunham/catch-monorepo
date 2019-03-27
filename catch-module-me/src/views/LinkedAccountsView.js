import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import {
  Text,
  Flex,
  Box,
  Link,
  PageTitle,
  PageWrapper,
  Icon,
  styles,
  colors,
  withDimensions,
} from '@catch/rio-ui-kit';

import LinkedAccounts from '../containers/LinkedAccounts';
import PrimaryLinkedAccount from '../containers/PrimaryLinkedAccount';
import { SettingsGroup, SettingsLayout } from '../components';

const PREFIX = 'catch.module.me.LinkedAccountsView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  'PrimaryLinkedAccount.title': (
    <FormattedMessage id={`${PREFIX}.PrimaryLinkedAccount.title`} />
  ),
  'PrimaryLinkedAccount.subtitle': (
    <FormattedMessage id={`${PREFIX}.PrimaryLinkedAccount.subtitle`} />
  ),
  'LinkedAccounts.title': (
    <FormattedMessage id={`${PREFIX}.LinkedAccounts.title`} />
  ),
  'LinkedAccounts.addAccount': (
    <FormattedMessage id={`${PREFIX}.LinkedAccounts.addAccount`} />
  ),
};

const LinkedAccountsView = ({ breakpoints }) => (
  <SettingsLayout breakpoints={breakpoints}>
    <SettingsGroup title={COPY['PrimaryLinkedAccount.title']} key={2}>
      <ErrorBoundary Component={ErrorMessage}>
        <PrimaryLinkedAccount COPY={COPY} />
      </ErrorBoundary>
    </SettingsGroup>
    <SettingsGroup title={COPY['LinkedAccounts.title']} key={3}>
      <ErrorBoundary Component={ErrorMessage}>
        {Platform.OS === 'web' && (
          <Link
            to={{
              pathname: '/link-bank',
              state: { nextPath: '/me/accounts', shouldShowPlan: false },
            }}
          >
            <Box row align="center" mb={3} qaName="add-new-account">
              <Box mt="3px">
                <Icon fill={colors.flare} name="naked-plus" size={13} />
              </Box>
              <Text ml={1} weight="medium" color="link" size={15}>
                {COPY['LinkedAccounts.addAccount']}
              </Text>
            </Box>
          </Link>
        )}
        <LinkedAccounts />
      </ErrorBoundary>
    </SettingsGroup>
  </SettingsLayout>
);

const Component = withDimensions(LinkedAccountsView);

Component.displayName = 'LinkedAccountsView';

export default Component;
