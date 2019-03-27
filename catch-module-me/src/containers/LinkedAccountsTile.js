import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { createLogger } from '@catch/utils';
import {
  Box,
  Text,
  Paper,
  Divider,
  Icon,
  borderRadius,
  colors,
  shadow,
  bankColorNames,
} from '@catch/rio-ui-kit';
import { SetPrimaryAccount } from '@catch/common';
import { AccountRow, OfflineWarning } from '../components';

const Log = createLogger('linked-accounts-tile');

const LinkedAccountsTile = ({
  onSetPrimaryAccount,
  accounts,
  deleteBankLink,
  syncStatus,
  bank: { name },
  lastUpdated,
  id,
  isPrimary,
  ...rest
}) => {
  const styles = StyleSheet.create({
    base: {
      borderRadius: borderRadius.regular,
    },
    header: {
      backgroundColor: bankColorNames[name] || colors.smoke,
      borderTopLeftRadius: borderRadius.regular,
      borderTopRightRadius: borderRadius.regular,
    },
    wrapper: {
      ...shadow.card,
      borderRadius: borderRadius.regular,
      borderWidth: 1,
      borderColor: colors['ink+3'],
    },
  });
  return (
    <Box style={styles.wrapper} my={1} qaName="linked-account-card">
      <Box
        row
        style={styles.header}
        py={1}
        px={2}
        align="center"
        justify="space-between"
      >
        <Box>
          <Text color="white" weight="bold" size={16} textCase="capitalize">
            {name}
          </Text>
          {syncStatus === 'LOGIN_ERROR' && (
            <OfflineWarning lastUpdated={lastUpdated} inverted mt={1} />
          )}
        </Box>
        {(syncStatus !== 'GOOD' || !isPrimary) && (
          <Icon
            name="trash"
            size={20}
            dynamicRules={{ paths: { fill: colors.white } }}
            fill={colors.white}
            onClick={() => deleteBankLink({ variables: { input: { id } } })}
          />
        )}
      </Box>
      {accounts.map((account, i) => (
        <Box key={account.id} mb={1} px={1}>
          <SetPrimaryAccount onCompleted={onSetPrimaryAccount}>
            {({ setPrimaryAccount, loading: updating }) => (
              <AccountRow
                onSetPrimaryAccount={() =>
                  setPrimaryAccount({
                    variables: {
                      input: {
                        accountId: account.id,
                        isPrimary: !account.isPrimary,
                      },
                    },
                  })
                }
                syncStatus={syncStatus}
                {...account}
                updating={updating}
              />
            )}
          </SetPrimaryAccount>
          {accounts.indexOf(account) !== accounts.length - 1 &&
            accounts.length > 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};

LinkedAccountsTile.propTypes = {
  accounts: PropTypes.array.isRequired,
  deleteBankLink: PropTypes.func.isRequired,
  isPrimary: PropTypes.bool.isRequired,
  bank: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default LinkedAccountsTile;
