import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('plan-status');

export const PLAN_STATUS = gql`
  query PlanStatus($periodFilter: DatePeriod!) {
    viewer {
      user {
        id
        confidence {
          taxesConfidence
          ptoConfidence
          retirementConfidence
        }
        hiddenRecommendations
        kycSavings {
          status
          needed
        }
        verticalInterest {
          healthInsuranceInterest
          retirementInterest
        }
        workType
      }
      taxGoal {
        id
        status
        paycheckPercentage
        availableBalance
        isAccountReady
      }
      retirementGoal {
        id
        status
        paycheckPercentage
        isAccountReady
        wealthAccount {
          balance
        }
      }
      ptoGoal {
        id
        status
        paycheckPercentage
        availableBalance
        isAccountReady
        plannedTarget
        unplannedTarget
      }
      savingsAccountMetadata {
        isAccountLocked
        isAccountReady
      }
      planHistorySummary(period: $periodFilter) {
        grossIncomeW2
        grossIncome1099
      }
      survey {
        id
        hasFinished
      }
      latestRecommendations {
        surveyID
        recommendations {
          id
          type
          importance
          needBasedImportance
          isActedOn
          reason
        }
      }
    }
  }
`;

const isGoalLive = goal => !!goal && goal.status !== 'DRAFT';
const isGoalActive = goal => !!goal && goal.status === 'ACTIVE';
const isGoalDraft = goal => !!goal && goal.status === 'DRAFT';
const isGoalPaused = goal => !!goal && goal.status === 'PAUSED';
const isAccountReady = goal => !!goal && !!goal.isAccountReady;

// if the kyc is pending or null and the goal exists with an active status
const isGoalProcessing = ({ goalStatus, kycStatus, isAccountReady }) =>
  ((goalStatus === 'ACTIVE' || goalStatus === 'PAUSED') &&
    kycStatus === 'KYC_PENDING') ||
  ((goalStatus === 'ACTIVE' || goalStatus === 'PAUSED') &&
    kycStatus === null) ||
  ((goalStatus === 'ACTIVE' || goalStatus === 'PAUSED') &&
    kycStatus === 'KYC_REVIEW') ||
  !isAccountReady;

export const createRecReducer = (
  filter,
  hasTaxGoal,
  hasPtoGoal,
  hasRetirementGoal,
  workType,
) => (results, target) => {
  if (filter.test(target.importance)) {
    if (
      target.type === 'PLANTYPE_TAX' &&
      !hasTaxGoal &&
      // Don't suggest Tax plan if user workType is W2
      workType !== 'WORK_TYPE_W2'
    ) {
      return results.concat([target]);
    }
    if (target.type === 'PLANTYPE_PTO' && !hasPtoGoal) {
      return results.concat([target]);
    }
    if (target.type === 'PLANTYPE_RETIREMENT' && !hasRetirementGoal) {
      return results.concat([target]);
    }
  }
  return results;
};

// @TODO further break this down depending on kycNeeded scenarios, will need a isDenied state

const PlanStatus = ({ children }) => (
  <Query
    query={PLAN_STATUS}
    variables={{ periodFilter: 'ANY' }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data, refetch }) => {
      if (error) Log.error(error);

      const taxGoal = access(data, 'viewer.taxGoal');
      const ptoGoal = access(data, 'viewer.ptoGoal');
      const retirementGoal = access(data, 'viewer.retirementGoal');

      const confidence = access(data, 'viewer.user.confidence');
      const hiddenRecommendations = access(
        data,
        'viewer.user.hiddenRecommendations',
      );
      const kycStatus = access(data, 'viewer.user.kycSavings.status');
      const kycNeeded = access(data, 'viewer.user.kycSavings.needed');
      const verticalInterest = access(data, 'viewer.user.verticalInterest');

      const workType = access(data, 'viewer.user.workType');

      const isAccountLocked = access(
        data,
        'viewer.savingsAccountMetadata.isAccountLocked',
      );
      const isSavingsAccountReady =
        !isAccountLocked &&
        access(data, 'viewer.savingsAccountMetadata.isAccountReady');

      Log.debug({ hiddenRecommendations });
      Log.debug({ kycStatus, kycNeeded });

      const hasConfidence = !!confidence && !!confidence.ptoConfidence;

      const hasTaxGoal = isGoalLive(taxGoal);
      const hasPtoGoal = isGoalLive(ptoGoal);
      const hasRetirementGoal = isGoalLive(retirementGoal);

      const hasBalance =
        (!!hasTaxGoal && taxGoal.availableBalance > 0) ||
        (!!hasPtoGoal && ptoGoal.availableBalance > 0) ||
        (!!hasRetirementGoal &&
          access(retirementGoal, 'wealthAccount.balance') > 0);

      // If user has goals, return which goals they have else return false
      // Decides if we render suggestion cards and in what state
      const hasGoals = (hasTaxGoal || hasPtoGoal || hasRetirementGoal) && {
        hasTaxGoal,
        hasPtoGoal,
        hasRetirementGoal,
      };

      const hasAllGoals = hasTaxGoal && hasPtoGoal && hasRetirementGoal;

      const hasFinishedSurvey = access(data, 'viewer.survey.hasFinished');
      const recommendations =
        access(data, 'viewer.latestRecommendations.recommendations') || [];

      const recStatus = /IMPORTANT|VITAL/;
      const suggested = createRecReducer(
        recStatus,
        hasTaxGoal,
        hasPtoGoal,
        hasRetirementGoal,
        workType,
      );
      // For now we filter out plans we offer from all the recs
      const suggestedPlans = recommendations.reduce(suggested, []);
      const addStatus = /CONSIDER|COVERED|NONE/;
      const additional = createRecReducer(
        addStatus,
        hasTaxGoal,
        hasPtoGoal,
        hasRetirementGoal,
        workType,
      );
      const additionalPlans = recommendations.reduce(additional, []);

      // Handle legacy recommendations
      if (hasConfidence && suggestedPlans.length === 0) {
        if (!hasTaxGoal) {
          suggestedPlans.push({
            id: 'PLANTYPE_TAX',
            type: 'PLANTYPE_TAX',
            needBasedImportance: 'NONE',
            importance: 'NONE',
          });
        }
        if (!hasPtoGoal) {
          suggestedPlans.push({
            id: 'PLANTYPE_PTO',
            type: 'PLANTYPE_PTO',
            needBasedImportance: 'NONE',
            importance: 'NONE',
          });
        }
        if (!hasRetirementGoal) {
          suggestedPlans.push({
            id: 'PLANTYPE_RETIREMENT',
            type: 'PLANTYPE_RETIREMENT',
            needBasedImportance: 'NONE',
            importance: 'NONE',
          });
        }
      }

      const draftGoals = {
        tax: isGoalDraft(taxGoal),
        pto: isGoalDraft(ptoGoal),
        retirement: isGoalDraft(retirementGoal),
      };

      Log.debug({ draftGoals });

      // Decides if we should render a GoalCardActive and in what state
      const activeGoals = {
        tax: hasTaxGoal && {
          status: taxGoal.status,
          paycheckPercentage: taxGoal.paycheckPercentage,
          availableBalance: taxGoal.availableBalance,
          isProcessing: isGoalProcessing({
            goalStatus: taxGoal.status,
            kycStatus,
            kycNeeded,
            isAccountReady: taxGoal.isAccountReady,
          }),
        },
        pto: hasPtoGoal && {
          status: ptoGoal.status,
          paycheckPercentage: ptoGoal.paycheckPercentage,
          availableBalance: ptoGoal.availableBalance,
          plannedTarget: ptoGoal.plannedTarget,
          unplannedTarget: ptoGoal.unplannedTarget,
          isProcessing: isGoalProcessing({
            goalStatus: ptoGoal.status,
            kycStatus,
            kycNeeded,
            isAccountReady: ptoGoal.isAccountReady,
          }),
        },
        retirement: hasRetirementGoal && {
          status: retirementGoal.status,
          paycheckPercentage: retirementGoal.paycheckPercentage,
          availableBalance:
            access(retirementGoal, 'wealthAccount.balance') || 0,
          isProcessing: isGoalProcessing({
            goalStatus: retirementGoal.status,
            kycStatus,
            kycNeeded,
            isAccountReady: retirementGoal.isAccountReady,
          }),
        },
      };

      // This should allow us to iterate on multiple goals when we have
      // custom settings
      let totalPercent = 0;
      const goalKeys = Object.keys(activeGoals);
      for (let i = 0, n = goalKeys.length; i < n; i++) {
        let curGoal = activeGoals[goalKeys[i]];
        if (!!curGoal && !!curGoal.paycheckPercentage) {
          totalPercent += curGoal.paycheckPercentage;
        }
      }
      Log.debug({ totalPercent });
      Log.debug({ activeGoals });

      const overallStatus =
        isGoalActive(taxGoal) ||
        isGoalActive(ptoGoal) ||
        isGoalActive(retirementGoal)
          ? 'ACTIVE'
          : isGoalPaused(ptoGoal) ||
            isGoalPaused(taxGoal) ||
            isGoalPaused(retirementGoal)
            ? 'PAUSED'
            : 'DRAFT';

      Log.debug({ overallStatus });

      // in the event there are no ready accounts, we'll show a screen/view that tells them they're account is being prepared/awaiting approval
      const hasAtLeastOneReadyAccount =
        isAccountReady(taxGoal) ||
        isAccountReady(ptoGoal) ||
        isAccountReady(retirementGoal);

      const grossW2Income = access(
        data,
        'viewer.planHistorySummary.grossIncomeW2',
      );
      const gross1099Income = access(
        data,
        'viewer.planHistorySummary.grossIncome1099',
      );

      const hasDiversifiedIncomeHistory =
        grossW2Income > 0 && gross1099Income > 0;

      return children({
        loading,
        error,
        hasGoals,
        hasAtLeastOneReadyAccount,
        hasBalance,
        confidence,
        hasConfidence,
        refetch,
        hiddenRecommendations,
        activeGoals,
        draftGoals,
        kycStatus,
        overallStatus,
        totalPercent,
        verticalInterest,
        workType,
        isSavingsAccountReady,
        hasAllGoals,
        hasDiversifiedIncomeHistory,
        hasFinishedSurvey,
        recommendations,
        suggestedPlans,
        additionalPlans,
      });
    }}
  </Query>
);

export default PlanStatus;
