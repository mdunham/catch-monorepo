import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { format } from 'date-fns';

import { Box, Icon, Text, colors } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.me.LinkedAccountsView.LinkedAccounts';
const COPY = {
  message: values => (
    <FormattedMessage id={`${PREFIX}.syncStatus.LOGIN_ERROR`} values={values} />
  ),
};

const OfflineWarning = ({ lastUpdated, inverted, ...other }) => (
  <Box row {...other}>
    <Icon
      name="warning"
      size={14}
      dynamicRules={{
        paths: inverted
          ? [{ fill: colors.white }, { fill: colors.smoke }]
          : [{ fill: colors.honey }, { fill: colors.white }],
      }}
    />
    <Text
      ml={1}
      weight="medium"
      color={inverted ? 'white' : 'honey--dark1'}
      size="small"
    >
      {COPY['message']({
        lastUpdated: format(lastUpdated, 'H:mm A M/DD/YYYY'),
      })}
    </Text>
  </Box>
);

OfflineWarning.propTypes = {
  message: PropTypes.object,
  inverted: PropTypes.bool,
};

export default OfflineWarning;
