import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Box, Button, Text, Paper } from '@catch/rio-ui-kit';
import { FullDate, preDateWord, Currency } from '@catch/utils';

const PREFIX = 'catch.module.home.IncomeCard';
export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  titleLong: values => (
    <FormattedMessage id={`${PREFIX}.titleLong`} values={values} />
  ),
  caption: <FormattedMessage id={`${PREFIX}.caption`} />,
  rejectText: <FormattedMessage id={`${PREFIX}.rejectText`} />,
  validateText: <FormattedMessage id={`${PREFIX}.validateText`} />,
};

const IncomeCard = ({
  onReject,
  onValidate,
  amount,
  date,
  bank,
  disabled,
  viewport,
}) => (
  <Paper p={3} mb={2} m={1} opaque={disabled}>
    <Text mb={3}>
      {COPY[preDateWord(date) ? 'titleLong' : 'title']({
        amount: (
          <Text weight="bold">
            <Currency>{amount}</Currency>
          </Text>
        ),
        date: (
          <Text weight="bold">
            <FullDate>{date}</FullDate>
          </Text>
        ),
        bank: <Text>{bank}</Text>,
      })}
    </Text>
    <Text mb={3} weight="bold">
      {COPY['caption']}
    </Text>
    <Box row w={1} justify="space-between">
      <Button
        type="light"
        style={{ width: '49%', opacity: 1 }}
        disabled={disabled}
        onClick={onReject}
        viewport={viewport}
      >
        {COPY['rejectText']}
      </Button>
      <Button
        style={{ width: '49%', opacity: 1 }}
        viewport={viewport}
        disabled={disabled}
        onClick={onValidate}
      >
        {COPY['validateText']}
      </Button>
    </Box>
  </Paper>
);

IncomeCard.propTypes = {
  amount: PropTypes.number.isRequired,
  bank: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onReject: PropTypes.func,
  onValidate: PropTypes.func,
};

IncomeCard.defaultProps = {
  disabled: false,
};

export default IncomeCard;
