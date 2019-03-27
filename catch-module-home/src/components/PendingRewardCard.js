import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Paper, Text, Button, colors } from '@catch/rio-ui-kit';
import { Currency } from '@catch/utils';

const PREFIX = 'catch.module.home.PendingRewardCard';
export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  body: <FormattedMessage id={`${PREFIX}.body`} />,
  button: <FormattedMessage id={`${PREFIX}.button`} />,
};

// TODO: a real notification card that can be dismissed etc
const PendingRewardCard = ({ amount, viewport, onStart }) => (
  <Paper p={3} mb={2} m={1}>
    <Text mb={2} weight="bold">
      {COPY['title']({ amount: <Currency>{amount}</Currency> })}
    </Text>
    <Text mb={4}>{COPY['body']}</Text>
    <Button
      type="success"
      viewport={viewport}
      onClick={onStart}
      style={{ width: '100%' }}
    >
      {COPY['button']}
    </Button>
  </Paper>
);

PendingRewardCard.propTypes = {
  amount: PropTypes.number.isRequired,
  onStart: PropTypes.func.isRequired,
};

export default PendingRewardCard;
