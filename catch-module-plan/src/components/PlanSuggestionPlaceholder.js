import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, Text, Fine, colors, borderRadius } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.plan.PlanSuggestionPlaceholder';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  link: <FormattedMessage id={`${PREFIX}.link`} />,
};

const border = {
  borderRadius: borderRadius.regular,
  borderWidth: 1,
  borderStyle: 'dashed',
  borderColor: colors.gray4,
};

const PlanSuggestionPlaceholder = () => (
  <Box p={3} style={border} mb={3}>
    <Box mb={2}>
      <Text weight="bold" size={20} color="gray4">
        {COPY['title']}
      </Text>
    </Box>
    <Text color="gray3">
      {COPY['subtitle']} <Fine link>{COPY['link']}</Fine>
    </Text>
  </Box>
);

export default PlanSuggestionPlaceholder;
