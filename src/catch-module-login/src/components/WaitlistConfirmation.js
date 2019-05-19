import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, Text, H2, Icon, Link, colors } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.login.WaitlistConfirmation';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: <FormattedMessage id={`${PREFIX}.p1`} />,
  p2: <FormattedMessage id={`${PREFIX}.p2`} />,
};

const WaitlistConfirmation = ({ viewport }) => (
  <Box>
    <H2
      mb={viewport === 'PhoneOnly' ? 2 : 4}
      size={viewport === 'PhoneOnly' ? 18 : 24}
    >
      {COPY['title']}
    </H2>
    <Text mb={2}>{COPY['p1']}</Text>
    <Text mb={2}>{COPY['p2']}</Text>
    <Box row w={183} align="center" justify="space-between" mt={4}>
      <Link to="https://angel.co/catchco" newTab container>
        <Icon
          name="angellist"
          size={24}
          fill={colors.smoke}
          dynamicRules={{ paths: { fill: colors.smoke } }}
        />
      </Link>
      <Link to="https://twitter.com/trycatchco" newTab container>
        <Icon
          name="twitter"
          size={24}
          fill={colors.smoke}
          dynamicRules={{ paths: { fill: colors.smoke } }}
        />
      </Link>
      <Link to="https://www.linkedin.com/company/catchco/" newTab container>
        <Icon
          name="linkedin"
          size={24}
          fill={colors.smoke}
          dynamicRules={{ paths: { fill: colors.smoke } }}
        />
      </Link>
      <Link to="https://medium.com/trycatch" newTab container>
        <Icon
          name="medium"
          size={24}
          fill={colors.smoke}
          dynamicRules={{ paths: { fill: colors.smoke } }}
        />
      </Link>
    </Box>
  </Box>
);

export default WaitlistConfirmation;
