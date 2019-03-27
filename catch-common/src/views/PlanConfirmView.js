import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View, StyleSheet, Platform } from 'react-native';

import {
  trackIntercom,
  Percentage,
  createLogger,
  Currency,
  Segment,
} from '@catch/utils';
import {
  Text,
  Fine,
  Box,
  Icon,
  colors,
  SplitLayout,
  PageTitle,
  Link,
  withDimensions,
  PageLayout,
} from '@catch/rio-ui-kit';

import {
  FlowLayout,
  ConfirmationLoading,
  BonusCard,
  EditPlanCard,
  FolioFooter,
} from '../components';

import { postToHubspot } from '../analytics';

const Log = createLogger('plan-confirm');

const PREFIX = 'catch.plans.PlanConfirmView';
export const COPY = {
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  pTitle: <FormattedMessage id={`${PREFIX}.pTitle`} />,
  pLine1: <FormattedMessage id={`${PREFIX}.pLine1`} />,
  pLine2: <FormattedMessage id={`${PREFIX}.pLine2`} />,
  pLine3: values => (
    <FormattedMessage id={`${PREFIX}.pLine3`} values={values} />
  ),
  asideSubtitle: values => (
    <FormattedMessage id={`${PREFIX}.asideSubtitle`} values={values} />
  ),
  editButton: <FormattedMessage id={`${PREFIX}.editButton`} />,
  disclosure: <FormattedMessage id={`${PREFIX}.disclosure`} />,
  disclosureLink: <FormattedMessage id={`${PREFIX}.disclosureLink`} />,
  savingMessage: <FormattedMessage id={`${PREFIX}.savingMessage`} />,
  ensuringMessage: <FormattedMessage id={`${PREFIX}.ensuringMessage`} />,
  successMessage: <FormattedMessage id={`${PREFIX}.successMessage`} />,
  'processingToast.title': values => (
    <FormattedMessage id={`${PREFIX}.processingToast.title`} values={values} />
  ),
  'processingToast.msg': values => (
    <FormattedMessage id={`${PREFIX}.processingToast.msg`} values={values} />
  ),
  'readyToast.title': values => (
    <FormattedMessage id={`${PREFIX}.readyToast.title`} values={values} />
  ),
  'readyToast.msg': values => (
    <FormattedMessage id={`${PREFIX}.readyToast.msg`} values={values} />
  ),
  'bonusToast.title': values => (
    <FormattedMessage id={`${PREFIX}.bonusToast.title`} values={values} />
  ),
  'bonusToast.msg': <FormattedMessage id={`${PREFIX}.bonusToast.msg`} />,
  'bonusToast.msg.noPto': (
    <FormattedMessage id={`${PREFIX}.bonusToast.msg.noPto`} />
  ),
  'bonusCard.title': values => (
    <FormattedMessage id={`${PREFIX}.bonusCard.title`} values={values} />
  ),
  'retirement.subtitle1': (
    <FormattedMessage id={`${PREFIX}.retirement.subtitle1`} />
  ),
  'retirement.subtitle2': values => (
    <FormattedMessage id={`${PREFIX}.retirement.subtitle2`} values={values} />
  ),
  'retirement.subtitle2.link': (
    <FormattedMessage id={`${PREFIX}.retirement.subtitle2.link`} />
  ),
};

const wait = n => new Promise(resolve => setTimeout(resolve, n));

const styles = StyleSheet.create({
  base: {
    height: '100%',
  },
});

export class PlanConfirmView extends React.Component {
  static propTypes = {
    goalName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    savedTime: 1000,
    ensuredTime: 500,
    successTime: 1500,
  };

  state = {
    status: null,
  };

  handleAnalytics = () => {
    const { paycheckPercentage, goalName } = this.props;
    Segment.goalAdded(goalName);

    // hubspot tracking
    const hubspotProps = {
      Tax: 'tax_plan',
      PTO: 'pto_plan',
      Retirement: 'retirement_plan',
    };

    const payload = [
      {
        property: hubspotProps[goalName],
        value: paycheckPercentage,
      },
    ];

    postToHubspot({
      endpoint: 'CREATE_OR_UPDATE',
      payload,
    });

    // intercom tracking
    const intercomProps = {
      Tax: 'Tax Percent',
      PTO: 'Time Off Percent',
      Retirement: 'Retirement Percent',
    };

    trackIntercom(intercomProps[goalName], paycheckPercentage);
  };
  handleConfirm = async () => {
    const {
      ensureGoal,
      saveGoal,
      goalName,
      planName,
      onConfirm,
      savedTime,
      ensuredTime,
      successTime,
      popToast,
      hasRefBonus,
      bonusAmount,
    } = this.props;
    try {
      /**
       * @NOTE: refactor when the new async React comes out this will
       * be a piece of cake!
       */
      this.setState({
        status: 'saving',
      });
      const { data } = await saveGoal({
        variables: { input: { status: 'ACTIVE' } },
      });
      Log.debug(data[`upsert${goalName}Goal`].id);
      // Just to leave some time for the different messages
      await wait(savedTime);

      this.setState({
        status: 'ensuring',
      });

      const { data: ensureData } = await ensureGoal({
        variables: { goalID: data[`upsert${goalName}Goal`].id },
      });

      await wait(ensuredTime);

      this.setState({
        status: 'success',
      });

      this.handleAnalytics();

      await wait(successTime);

      const GOAL_SPECS = {
        Tax: {
          accountType: 'savings',
          numDays: '2-3',
        },
        PTO: {
          accountType: 'savings',
          numDays: '2-3',
        },
        Retirement: {
          accountType: 'investment',
          numDays: '5',
        },
      };

      Log.debug(ensureData[`ensure${goalName}Goal`].goalStatus);

      // @NOTE this might not work the same way for retirement
      if (ensureData[`ensure${goalName}Goal`].goalStatus === 'ALL_GOOD') {
        popToast({
          type: 'success',
          title: COPY['readyToast.title']({ goalName: planName }),
          msg: COPY['readyToast.msg'](GOAL_SPECS[goalName]),
        });
      } else {
        popToast({
          type: 'processing',
          title: COPY['processingToast.title']({ goalName: planName }),
          msg: COPY['processingToast.msg'](GOAL_SPECS[goalName]),
        });
      }
      if (hasRefBonus) {
        popToast({
          type: 'gift',
          title: COPY['bonusToast.title']({
            amount: <Currency>{bonusAmount}</Currency>,
          }),
          msg:
            COPY[
              goalName === 'PTO' ? 'bonusToast.msg' : 'bonusToast.msg.noPto'
            ],
        });
      }

      ensureData &&
      ensureData[`ensure${goalName}Goal`] &&
      (ensureData[`ensure${goalName}Goal`].goalStatus === 'ALL_GOOD' ||
        ensureData[`ensure${goalName}Goal`].goalStatus === 'PENDING_PROVIDER') // let the user get into catch up flow even if BBVA/Folio accounts are pending
        ? onConfirm({
            showCatchUp: goalName.toUpperCase(),
            ...ensureData,
          })
        : onConfirm(ensureData);
    } catch (e) {
      Log.error(e);

      onConfirm(e);
    }
  };
  render() {
    const {
      canFinish,
      planTitle,
      planName,
      goalName,
      onEdit,
      onConfirm,
      paycheckPercentage,
      viewport,
      planDisclosures,
      saving,
      ensuring,
      bonusAmount,
      hasRefBonus,
      ...rest
    } = this.props;
    const isMobile = viewport === 'PhoneOnly';
    const { status } = this.state;

    const editButton = (
      <Box pt={isMobile ? 1 : 100}>
        <EditPlanCard
          goalName={goalName}
          onEdit={onEdit}
          planTitle={planName}
          caption={COPY['asideSubtitle']({
            // Adds a darker accent to the light caption
            paycheckPercentage: (
              <Text size={14} weight="medium">
                <Percentage whole>{paycheckPercentage}</Percentage>
              </Text>
            ),
          })}
        />
        {/*
        {hasRefBonus &&
          goalName === 'PTO' && (
            <BonusCard
              title={COPY['bonusCard.title']({
                amount: <Currency>{bonusAmount}</Currency>,
              })}
            />
          )}
           */}
      </Box>
    );

    return (
      <React.Fragment>
        <FlowLayout
          buttonColor="secondary"
          onNext={this.handleConfirm}
          canClickNext={true}
          footer={goalName === 'retirement' && <FolioFooter />}
          isLoading={ensuring || saving}
          isLastStep
        >
          {!!status ? (
            <Box align="center" mt={5}>
              <ConfirmationLoading
                status={status}
                COPY={{
                  saving: COPY['savingMessage'],
                  ensuring: COPY['ensuringMessage'],
                  success: COPY['successMessage'],
                }}
              />
            </Box>
          ) : (
            <PageLayout viewport={viewport}>
              <SplitLayout>
                <Box py={isMobile && 2}>
                  <PageTitle
                    isMobile={isMobile}
                    viewport={viewport}
                    subtitle={
                      goalName === 'Retirement'
                        ? [
                            COPY['retirement.subtitle1'],
                            ' ',
                            COPY['retirement.subtitle2']({
                              link: (
                                <Link
                                  to="https://help.catch.co/using-the-platform/how-do-i-withdraw-my-money"
                                  newTab
                                  style={{ fontSize: 15 }}
                                >
                                  {COPY['retirement.subtitle2.link']}
                                </Link>
                              ),
                            }),
                          ]
                        : COPY['subtitle']
                    }
                    title={COPY['title']({
                      planTitle,
                    })}
                  />
                  {isMobile && editButton}
                  <Box mb={3}>
                    {goalName === 'retirement' ? null : (
                      <Text weight="medium" size="large">
                        {COPY['pTitle']}
                      </Text>
                    )}
                  </Box>
                  <Box row pb={3} align="center">
                    <Box mr={2}>
                      <Icon
                        dynamicRules={{ paths: { fill: colors.ink } }}
                        fill={colors.ink}
                        name="plancoin"
                        size={28}
                      />
                    </Box>
                    <Text>{COPY['pLine1']}</Text>
                  </Box>

                  <Box row pb={3} align="center">
                    <Box mr={2}>
                      <Icon
                        dynamicRules={{ paths: { fill: colors.ink } }}
                        fill={colors.ink}
                        name="planbadge"
                        size={28}
                      />
                    </Box>
                    <Text>{COPY['pLine2']}</Text>
                  </Box>
                  <Box row pb={5} align="center">
                    <Box mr={2}>
                      <Icon
                        dynamicRules={{ paths: { fill: colors.ink } }}
                        fill={colors.ink}
                        name="planpig"
                        size={Platform.select({ web: 30 })}
                      />
                    </Box>
                    <Text>
                      {COPY['pLine3']({
                        paycheckPercentage: (
                          <Percentage whole>{paycheckPercentage}</Percentage>
                        ),
                      })}
                    </Text>
                  </Box>
                  <Box mb={3}>
                    <Text>
                      {COPY['disclosure']}{' '}
                      <Link
                        weight="medium"
                        newTab
                        componentId="plan-flow"
                        to="/disclosures/communication-transfer"
                      >
                        {COPY['disclosureLink']}
                      </Link>
                    </Text>
                  </Box>
                  <Fine>{planDisclosures}</Fine>
                </Box>
                {!isMobile && editButton}
              </SplitLayout>
            </PageLayout>
          )}
        </FlowLayout>
      </React.Fragment>
    );
  }
}

PlanConfirmView.propTypes = {
  // has the user completed all of the steps required to finish this flow and open an account
  canFinish: PropTypes.bool,

  // the path for the beginning of the flow
  flowEntry: PropTypes.string,

  // the flow type
  flowType: PropTypes.string,

  // the next button func
  onConfirm: PropTypes.func,

  // the back button func
  onBack: PropTypes.func,

  // the paycheck percentage being withheld for a given flow
  paycheckPercentage: PropTypes.number,
};

const Component = withDimensions(PlanConfirmView);

Component.displayName = 'PlanConfirmView';

export default Component;
