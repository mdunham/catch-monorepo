import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import {
  Box,
  Flex,
  H2,
  Text,
  Spinner,
  Divider,
  Button,
  Paper,
  Link,
  borderRadius,
  colors,
  animations,
  Page,
  SplitLayout,
} from '@catch/rio-ui-kit';
import { formatCurrency, Percentage } from '@catch/utils';
import { Error } from '@catch/errors';

import SmallPageTitle from './SmallPageTitle';

import { ToggleGoal } from '../containers';

function GoalOverviewLayout({
  planName,
  goalStatus,
  onTrack,
  onEdit,
  onPause,
  onWithdraw,
  paycheckPercentage,
  title,
  balance,
  children,
  loading,
  error,
  ...rest
}) {
  if (loading) {
    return <Spinner />;
  } else if (error) {
    return <Error>{error}</Error>;
  } else {
    return (
      <Page mt={4}>
        <SplitLayout>
          <Box
            mx={3}
            style={{
              ...Platform.select({
                web: {
                  maxWidth: 350,
                  ...animations.fadeInUp,
                },
              }),
            }}
          >
            <Paper p={3} py={5} mb={3}>
              <Box align="center">
                <Box mb={1}>
                  <H2>{title}</H2>
                </Box>
                <Flex row>
                  <Text size="large" weight="bold">
                    <Percentage whole>{paycheckPercentage}</Percentage>
                  </Text>
                  <Text size="large"> per paycheck</Text>
                </Flex>
              </Box>
              <Divider my={4} />
              <Box align="center">
                <H2 color="debit">{formatCurrency(balance || 0)}</H2>
              </Box>
            </Paper>
            <Paper p={3}>
              <Box mb={2}>
                <Link to="#" onClick={onEdit}>
                  <Text color="link" weight="medium" size="small">
                    Edit contribution
                  </Text>
                </Link>
              </Box>
              <ToggleGoal goalType={planName} currentStatus={goalStatus}>
                {({ toggleGoal }) => (
                  <Box mb={2}>
                    <Link
                      to="#"
                      onClick={() =>
                        toggleGoal({
                          variables: {
                            input: {
                              status:
                                goalStatus === 'PAUSED' ? 'ACTIVE' : 'PAUSED',
                            },
                          },
                        })
                      }
                    >
                      <Text color="link" weight="medium" size="small">
                        {goalStatus === 'PAUSED' ? 'Resume plan' : 'Pause plan'}
                      </Text>
                    </Link>
                  </Box>
                )}
              </ToggleGoal>
              {balance > 0 && (
                <Box>
                  <Link to="#" onClick={onWithdraw}>
                    <Text color="link" weight="medium" size="small">
                      Withdraw funds
                    </Text>
                  </Link>
                </Box>
              )}
            </Paper>
          </Box>
          <Box px={3}>{children}</Box>
        </SplitLayout>
      </Page>
    );
  }
}

export default GoalOverviewLayout;
