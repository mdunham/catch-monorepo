import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, Text, Dot, colors } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.login.OnboardingInfo';
export const COPY = {
  'section1.title': <FormattedMessage id={`${PREFIX}.section1.title`} />,
  'section1.b1': <FormattedMessage id={`${PREFIX}.section1.b1`} />,
  'section1.b2': <FormattedMessage id={`${PREFIX}.section1.b2`} />,
  'section1.b3': <FormattedMessage id={`${PREFIX}.section1.b3`} />,
  'section1.b4': <FormattedMessage id={`${PREFIX}.section1.b4`} />,
  'section1.b5': <FormattedMessage id={`${PREFIX}.section1.b5`} />,
  'section2.title': <FormattedMessage id={`${PREFIX}.section2.title`} />,
  'section2.p1': <FormattedMessage id={`${PREFIX}.section2.p1`} />,
  'section2.p2': <FormattedMessage id={`${PREFIX}.section2.p2`} />,
  'section3.title': <FormattedMessage id={`${PREFIX}.section3.title`} />,
  'section3.p1': <FormattedMessage id={`${PREFIX}.section3.p1`} />,
  'section3.p2': <FormattedMessage id={`${PREFIX}.section3.p2`} />,
  'section3.p3': <FormattedMessage id={`${PREFIX}.section3.p3`} />,
};

export default [
  {
    title: COPY['section1.title'],
    content: (
      <Box ml={2} mb={2}>
        <Box mb={1} row>
          <Dot size={5} color={colors.ink} mt={1} />
          <Text ml={1}>{COPY['section1.b1']}</Text>
        </Box>
        <Box mb={1} row>
          <Dot size={5} color={colors.ink} mt={1} />
          <Text ml={1}>{COPY['section1.b2']}</Text>
        </Box>
        <Box mb={1} row>
          <Dot size={5} color={colors.ink} mt={1} />
          <Text ml={1}>{COPY['section1.b3']}</Text>
        </Box>
        <Box mb={1} row>
          <Dot size={5} color={colors.ink} mt={1} />
          <Text ml={1}>{COPY['section1.b4']}</Text>
        </Box>
        <Box mb={1} row>
          <Dot size={5} color={colors.ink} mt={1} />
          <Text ml={1}>{COPY['section1.b5']}</Text>
        </Box>
      </Box>
    ),
  },
  {
    title: COPY['section2.title'],
    content: (
      <Box ml={2} mb={2}>
        <Text mb={1}>{COPY['section2.p1']}</Text>
        <Text mb={1}>{COPY['section2.p2']}</Text>
      </Box>
    ),
  },
  {
    title: COPY['section3.title'],
    content: (
      <Box ml={2} mb={2}>
        <Text mb={1}>{COPY['section3.p1']}</Text>
        <Text mb={1}>{COPY['section3.p2']}</Text>
        <Text mb={1}>{COPY['section3.p3']}</Text>
      </Box>
    ),
  },
];
