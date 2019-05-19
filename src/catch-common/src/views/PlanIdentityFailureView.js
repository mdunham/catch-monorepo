import React, { Component } from 'react';
import { Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { goTo } from '@catch/utils';

import {
  Box,
  H1,
  Text,
  Button,
  Paper,
  animations,
  PageWrapper,
  withDimensions,
  colors,
} from '@catch/rio-ui-kit';

const style = {
  ...animations.fadeInNext,
};

const PREFIX = 'catch.plans.PlanIdentityFailureView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  buttonConfirm: <FormattedMessage id={`${PREFIX}.buttonConfirm`} />,
};

class PlanIdentityFailureView extends Component {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  render() {
    const { viewport } = this.props;
    const isMobile = viewport === 'PhoneOnly';
    return (
      <PageWrapper
        style={
          isMobile
            ? { backgroundColor: colors.white, height: '100%' }
            : undefined
        }
      >
        <Box
          align="center"
          p={Platform.select({ web: 5, default: 2 })}
          style={style}
        >
          <Box mb={2}>
            <H1 color="emphasis">{COPY['title']}</H1>
          </Box>
          <Box
            align={Platform.select({ web: 'center', default: 'flex-start' })}
          >
            <Box mb={5}>
              <Text center={Platform.select({ web: true, default: false })}>
                {COPY['subtitle']}
              </Text>
            </Box>
            <Box row w={1} justify="center">
              <Button
                onClick={() => this.goTo(['/me', '/info'])}
                wide={isMobile}
              >
                {COPY['buttonConfirm']}
              </Button>
            </Box>
          </Box>
        </Box>
      </PageWrapper>
    );
  }
}

export default withDimensions(PlanIdentityFailureView);
