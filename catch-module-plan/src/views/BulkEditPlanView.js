import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text as RNText,
} from 'react-native';
import { getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import {
  Box,
  Text,
  SplitLayout,
  Button,
  Spinner,
  Paper,
  colors,
  animations,
  Divider,
  PageLayout,
  withDimensions,
  styles,
} from '@catch/rio-ui-kit';
import {
  goTo,
  navigationPropTypes,
  calculatePTOMetrics,
  Percentage,
} from '@catch/utils';
import { toastActions } from '@catch/errors';

import {
  AllocationsBreakdown,
  BulkEditPlan,
  PlanStatus,
  UpdateAllocations,
} from '../containers';

/***
 * @TODO: TEST THIS ENTIRE VIEW
 */

const PREFIX = 'catch.module.plan.BulkEditPlanView';
export const COPY = {
  'successToast.title': (
    <FormattedMessage id={`${PREFIX}.successToast.title`} />
  ),
  'successToast.msg': <FormattedMessage id={`${PREFIX}.successToast.msg`} />,
};

export const handlePTOCalculations = ({ formValues, goal }) => {
  if (goal) {
    if (formValues) {
      return calculatePTOMetrics({
        numberOfDays: formValues.plannedTarget + formValues.unplannedTarget,
        plannedTarget: formValues.plannedTarget,
        unplannedTarget: formValues.unplannedTarget,
      });
    } else {
      return calculatePTOMetrics({
        numberOfDays: goal.plannedTarget + goal.unplannedTarget,
        plannedTarget: goal.plannedTarget,
        unplannedTarget: goal.unplannedTarget,
      });
    }
  }

  return null;
};

export class BulkEditPlanView extends Component {
  static propTypes = {
    formValues: PropTypes.object,
    popToast: PropTypes.func,
    match: PropTypes.object,
    ...navigationPropTypes,
  };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  handlePTOCalculations = ({ goal }) => {
    if (goal) {
      if (this.props.formValues) {
        const { formValues } = this.props;
        return calculatePTOMetrics({
          numberOfDays: formValues.plannedTarget + formValues.unplannedTarget,
          plannedTarget: formValues.plannedTarget,
          unplannedTarget: formValues.unplannedTarget,
        });
      } else {
        return calculatePTOMetrics({
          numberOfDays: goal.plannedTarget + goal.unplannedTarget,
          plannedTarget: goal.plannedTarget,
          unplannedTarget: goal.unplannedTarget,
        });
      }
    }

    return null;
  };

  calcPercentages = ({ activeGoals }) => {
    const { formValues } = this.props;

    let totalPercentage = [];

    if (activeGoals.pto) {
      totalPercentage.push(
        handlePTOCalculations({ goal: activeGoals.pto, formValues })
          .plannedPaycheckPercentage,
      );
      totalPercentage.push(
        handlePTOCalculations({ goal: activeGoals.pto, formValues })
          .unplannedPaycheckPercentage,
      );
    }

    if (activeGoals.retirement) {
      totalPercentage.push(
        formValues
          ? formValues.retirementPercentage
          : activeGoals.retirement.paycheckPercentage,
      );
    }

    if (activeGoals.tax) {
      totalPercentage.push(
        formValues
          ? formValues.taxPercentage
          : activeGoals.tax.paycheckPercentage,
      );
    }

    const results = {
      total: totalPercentage.reduce((acc, value) => {
        return acc + value;
      }),
      pto:
        activeGoals.pto &&
        this.handlePTOCalculations({ goal: activeGoals.pto })
          .paycheckPercentage,
      ptoPercentages:
        activeGoals.pto &&
        this.handlePTOCalculations({ goal: activeGoals.pto }),
      retirement: activeGoals.retirement
        ? formValues
          ? formValues.retirementPercentage
          : activeGoals.retirement.paycheckPercentage
        : null,
      tax: activeGoals.tax
        ? formValues
          ? formValues.taxPercentage
          : activeGoals.tax.paycheckPercentage
        : null,
    };

    return results;
  };

  buildSavePayload = ({ activeGoals }) => {
    const { formValues } = this.props;

    return {
      ptoGoalInput: {
        plannedTarget: activeGoals.pto ? formValues.plannedTarget : null,
        unplannedTarget: activeGoals.pto ? formValues.unplannedTarget : null,
        paycheckPercentage: activeGoals.pto
          ? handlePTOCalculations({
              goal: activeGoals.pto,
              formValues,
            }).paycheckPercentage
          : null,
      },
      retirementGoalInput: {
        paycheckPercentage: activeGoals.retirement
          ? formValues.retirementPercentage
          : null,
      },
      taxGoalInput: {
        paycheckPercentage: activeGoals.tax ? formValues.taxPercentage : null,
      },
    };
  };

  handleCompleted = () => {
    this.goTo(['/plan']);
    this.props.popToast({
      title: COPY['successToast.title'],
      msg: COPY['successToast.msg'],
      type: 'success',
    });
  };

  render() {
    const { formValues, push, popToast, viewport } = this.props;
    const isNative = Platform.OS !== 'web';
    return (
      <PlanStatus>
        {({ loading, activeGoals, totalPercent }) => (
          <SafeAreaView style={styles.get('Flex1')}>
            <ScrollView>
              <PageLayout
                viewport={viewport}
                style={styles.get('LgBottomGutter')}
              >
                <RNText
                  style={styles.get(
                    ['H3', 'TopGutter', 'BottomGutter'],
                    viewport,
                  )}
                >
                  Edit Plan
                </RNText>
                {loading ? (
                  <Box p={3} w={1} align="center" mt={100}>
                    <Spinner large />
                  </Box>
                ) : (
                  <SplitLayout>
                    <Paper
                      align="flex-start"
                      p={isNative ? 0 : 3}
                      mb={3}
                      flat={isNative}
                      style={{
                        ...Platform.select({
                          web: {
                            maxWidth: 400,
                            ...animations.fadeInUp,
                          },
                        }),
                      }}
                    >
                      <Box w={1}>
                        <BulkEditPlan
                          formValues={formValues}
                          goals={activeGoals}
                          livePercentages={this.calcPercentages({
                            activeGoals,
                          })}
                          ptoCalculations={
                            activeGoals.pto &&
                            this.handlePTOCalculations({
                              goal: activeGoals.pto,
                            })
                          }
                        />
                      </Box>
                    </Paper>
                    {isNative ? (
                      <React.Fragment>
                        <Divider />
                        <Box row justify="space-between" p={2}>
                          <Text size={28} weight="medium">
                            Total:
                          </Text>
                          <Box>
                            <Text mb={1} size={28} weight="medium">
                              <Percentage>
                                {formValues
                                  ? this.calcPercentages({ activeGoals }).total
                                  : totalPercent}
                              </Percentage>
                            </Text>
                            <Text color="ash">per paycheck</Text>
                          </Box>
                        </Box>
                      </React.Fragment>
                    ) : (
                      <Box justify="flex-end">
                        <Paper
                          align="center"
                          p={4}
                          px={3}
                          style={{
                            ...Platform.select({
                              web: {
                                maxWidth: 400,
                                ...animations.fadeInUp,
                              },
                            }),
                          }}
                        >
                          <Box w={1}>
                            <AllocationsBreakdown
                              formValues={formValues}
                              total={
                                formValues
                                  ? this.calcPercentages({ activeGoals }).total
                                  : totalPercent
                              }
                              goals={activeGoals}
                              livePercentages={this.calcPercentages({
                                activeGoals,
                              })}
                            />
                          </Box>
                        </Paper>
                        {viewport !== 'PhoneOnly' && (
                          <Box
                            mt={4}
                            style={{
                              ...Platform.select({
                                web: {
                                  maxWidth: 400,
                                  ...animations.fadeInUp,
                                },
                              }),
                            }}
                          >
                            <UpdateAllocations
                              afterComplete={this.handleCompleted}
                            >
                              {({ updateAllocations }) => (
                                <Box row justify="flex-end">
                                  <Box mr={2}>
                                    <Button
                                      onClick={() => this.goTo('/plan')}
                                      type="light"
                                    >
                                      Cancel
                                    </Button>
                                  </Box>
                                  <Box>
                                    <Button
                                      onClick={() =>
                                        updateAllocations({
                                          variables: this.buildSavePayload({
                                            activeGoals,
                                          }),
                                        })
                                      }
                                    >
                                      Submit
                                    </Button>
                                  </Box>
                                </Box>
                              )}
                            </UpdateAllocations>
                          </Box>
                        )}
                      </Box>
                    )}
                  </SplitLayout>
                )}
              </PageLayout>
            </ScrollView>
            {// Necessary to stick it to the bottom
            viewport === 'PhoneOnly' && (
              <UpdateAllocations afterComplete={this.handleCompleted}>
                {({ updateAllocations }) => (
                  <Box
                    row
                    w={1}
                    style={{
                      height: 72,
                      backgroundColor: colors.white,
                    }}
                    pt={1}
                  >
                    <Box flex={1} m={1}>
                      <Button
                        wide
                        onClick={() => this.goTo('/plan', {}, 'RESET')}
                        type="outline"
                      >
                        Cancel
                      </Button>
                    </Box>
                    <Box flex={1} m={1}>
                      <Button
                        wide
                        onClick={() =>
                          updateAllocations({
                            variables: this.buildSavePayload({
                              activeGoals,
                            }),
                          })
                        }
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                )}
              </UpdateAllocations>
            )}
          </SafeAreaView>
        )}
      </PlanStatus>
    );
  }
}

const withRedux = connect(
  state => ({
    formValues: getFormValues('EditPlanForm')(state),
  }),
  { ...toastActions },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

export default enhance(BulkEditPlanView);
