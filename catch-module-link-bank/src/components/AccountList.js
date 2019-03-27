import React from 'react';
import PropTypes from 'prop-types';

import { ReduxRadioGroup, Radio, Text, styles } from '@catch/rio-ui-kit';

const AccountList = ({ accounts, breakpoints, ...other }) => (
  <ReduxRadioGroup {...other}>
    {accounts.map((account, index) => (
      <Radio
        key={`r-${index}`}
        py={2}
        name={account.name}
        value={account.id}
        containerStyle={breakpoints.select({
          PhoneOnly: styles.get('Divider'),
        })}
        label={
          <Text ml={2}>
            {account.nickname || account.name} -{' '}
            {account.accountNumber.slice(account.accountNumber.length - 4)}
          </Text>
        }
      />
    ))}
  </ReduxRadioGroup>
);

export default AccountList;
