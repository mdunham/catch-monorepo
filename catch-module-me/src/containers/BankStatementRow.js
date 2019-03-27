import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import { Box, Text, Icon, Link } from '@catch/rio-ui-kit';

import GetBankStatement from './GetBankStatement';

export const BankStatementRow = ({ date, id }) => (
  <GetBankStatement id={id}>
    {({ bankStatementURL, loading }) =>
      loading ? null : (
        <Link to={bankStatementURL || '#'} newTab container>
          <Box mb={2} row>
            <Box mt={1.5}>
              <Icon name="download" size={15} />
            </Box>
            <Text ml={2} weight="medium" color="link">
              {format(new Date(date), 'MMMM YYYY')}
            </Text>
          </Box>
        </Link>
      )
    }
  </GetBankStatement>
);

BankStatementRow.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default BankStatementRow;
