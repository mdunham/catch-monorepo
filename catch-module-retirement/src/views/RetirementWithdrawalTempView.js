import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Box, H3, H4, Text } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.retirement.RetirementWithdrawalTempView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: <FormattedMessage id={`${PREFIX}.p1`} />,
  p21: <FormattedMessage id={`${PREFIX}.p21`} />,
  p22: <FormattedMessage id={`${PREFIX}.p22`} />,
  p23: <FormattedMessage id={`${PREFIX}.p23`} />,
};

class TempView extends Component {
  render() {
    return (
      <Box>
        <H3>{COPY['title']}</H3>
        <Box mt={2}>
          <Text color="subtle">{COPY['p1']}</Text>
        </Box>
        {/* @TODO: get customer service link */}
        <Box my={2}>
          <Text color="subtle">
            {COPY['p21']}{' '}
            <Text weight="medium" color="link" onClick={() => {}}>
              {COPY['p22']}
            </Text>{' '}
            {COPY['p23']}
          </Text>
        </Box>
        <Box mt={1} row justify="flex-end">
          <Button onClick={this.props.onClose}>Gotcha</Button>
        </Box>
      </Box>
    );
  }
}

export default TempView;
