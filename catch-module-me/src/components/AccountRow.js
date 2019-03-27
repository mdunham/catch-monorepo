import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import { TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

import {
  Button,
  Icon,
  Flex,
  Box,
  Text,
  H5,
  Flag,
  borderRadius,
  colors,
  Dot,
} from '@catch/rio-ui-kit';
import { formatCurrency, accountRef, Env } from '@catch/utils';
import { OfflineWarning } from '../components';

const PREFIX = 'catch.module.me.LinkedAccountsView.LinkedAccounts';
export const COPY = {
  'syncStatus.GOOD': <FormattedMessage id={`${PREFIX}.syncStatus.GOOD`} />,
  'syncStatus.PENDING': (
    <FormattedMessage id={`${PREFIX}.syncStatus.PENDING`} />
  ),
  'syncStatus.SYNCING': (
    <FormattedMessage id={`${PREFIX}.syncStatus.SYNCING`} />
  ),
  'syncStatus.LOGIN_ERROR': values => (
    <FormattedMessage id={`${PREFIX}.syncStatus.LOGIN_ERROR`} values={values} />
  ),
  'syncStatus.LOGIN_ERROR.buttonText': (
    <FormattedMessage id={`${PREFIX}.syncStatus.LOGIN_ERROR.buttonText`} />
  ),
  primaryAccountLabel: (
    <FormattedMessage id={`${PREFIX}.primaryAccountLabel`} />
  ),
  updatingMsg: <FormattedMessage id={`${PREFIX}.updatingMsg`} />,
  makePrimary: <FormattedMessage id={`${PREFIX}.makePrimary`} />,
};

const AccountRow = ({
  accountNumber,
  onButtonClick,
  bankLink,
  onSetPrimaryAccount,
  isPrimary,
  nickname,
  syncStatus,
  name,
  onClick,
  denotePrimary,
  updating,
  bankName,
}) => (
  <Box
    px={1}
    py={2}
    style={{
      borderRadius: borderRadius.regular,
    }}
  >
    {denotePrimary &&
      isPrimary && (
        <Text weight="medium" size="small" mb={4.9}>
          {bankName}
        </Text>
      )}
    {!isPrimary &&
      syncStatus === 'LOGIN_ERROR' && (
        <Text weight="bold" color="peach" size="small" spacing={0.5} mb={0.5}>
          OFFLINE
        </Text>
      )}
    <Text weight={denotePrimary ? 'bold' : 'medium'}>
      {accountRef({ accountName: nickname || name, accountNumber })}
    </Text>
    {isPrimary &&
      denotePrimary &&
      (syncStatus === 'LOGIN_ERROR' ? (
        <OfflineWarning lastUpdated={bankLink.lastUpdated} mt={1} />
      ) : (
        <Box mt={7} row align="center">
          <Dot color="success" />
          <Text weight="medium" size="small" ml={1}>
            {Env.isTest ? 'Linked all good' : COPY[`syncStatus.${syncStatus}`]}
          </Text>
        </Box>
      ))}

    {isPrimary &&
      denotePrimary &&
      syncStatus === 'LOGIN_ERROR' && (
        <Box mt={3}>
          <Button onClick={onButtonClick} style={{ width: '100%' }}>
            {COPY['syncStatus.LOGIN_ERROR.buttonText']}
          </Button>
        </Box>
      )}
    {isPrimary &&
      !denotePrimary && (
        <Text size="small" weight="medium">
          {Env.isTest ? 'Primary account' : COPY['primaryAccountLabel']}
        </Text>
      )}

    {!isPrimary &&
      (updating ? (
        <Text size="small" weight="medium" style={{ opacity: 0.5 }}>
          {COPY['updatingMsg']}
        </Text>
      ) : (
        <TouchableOpacity onPress={onSetPrimaryAccount}>
          <Text color="link" size="small" weight="medium">
            {Env.isTest ? 'Make primary' : COPY['makePrimary']}
          </Text>
        </TouchableOpacity>
      ))}
  </Box>
);

AccountRow.propTypes = {
  accountNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  bankLink: PropTypes.object.isRequired,
  isPrimary: PropTypes.bool.isRequired,
  nickname: PropTypes.string,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  denotePrimary: PropTypes.bool.isRequired,
};

AccountRow.defaultProps = {
  denotePrimary: false,
};

export default AccountRow;
