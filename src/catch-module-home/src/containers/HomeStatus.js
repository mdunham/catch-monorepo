import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger, requiresIDV, getAccount } from '@catch/utils';

const Log = createLogger('home-status');

export const HOME_STATUS = gql`
  query HomeStatus(
    $incomeAction: [IncomeAction!]
    $rewardStatus: RewardStatus!
  ) {
    viewer {
      user {
        id
        givenName
        kycSavings {
          status
          needed
        }
        workType
      }
      incomeTransactions(incomeAction: $incomeAction) {
        id
        amount
        date
        status
        description
        accountID
      }
      savingsAccountMetadata {
        isAccountReady
        isAccountLocked
      }
      taxGoal {
        id
        status
        isAccountReady
      }
      retirementGoal {
        id
        status
        isAccountReady
      }
      ptoGoal {
        id
        status
        isAccountReady
      }
      primaryAccount {
        id
        bankLink {
          id
          syncStatus
          lastUpdated
          bank {
            id
            name
          }
        }
      }
      pendingRewards(status: $rewardStatus) {
        amount
      }
      documentUploads {
        provider
        type
      }
      bankLinks {
        id
        accounts {
          id
          accountNumber
        }
        bank {
          id
          name
        }
      }
      survey {
        id
        hasFinished
      }
      health {
        information {
          exitStage
          didEnroll
        }
        insurance {
          id
        }
        recommendation {
          id
          importance
        }
      }
    }
  }
`;

const isDraft = goal => goal.status === 'DRAFT';
const isAccountReady = goal => !!goal.isAccountReady;
const isPaused = goal => (goal ? goal.status === 'PAUSED' : true);

/**
 * The HomeView can be in 7 different states:
 * 1) NO_PLAN a user hasn't started on any goal or linked their bank
 * 2) PLAN_STARTED a user started on any goal but has not finished any and might already be receiving income
 * 3) @TODO PLAN_PROCESSING a user finished setting up a single plan but we are waiting for 3rd party to start transfering $$$
 * 4) VERIFICATION_REQUIRED action is needed to activate the plan properly
 * 2) NO_NOTIFICATIONS a user has an active plan but has never received notifications yet. No action needed.
 * 3) EMPTY a user has clicked on everything we wanted them to click on.
 * 4) NOTIFICATIONS a user needs to act on something
 * @NOTE: currently notifications are incomeTransactions though back end will set up a messages
 * endpoint to handle any kinds of notifications on the same endpoint.
 *
 */
const HomeStatus = ({ children }) => (
  <Query
    query={HOME_STATUS}
    fetchPolicy="cache-and-network"
    //@NOTE: We add other income actions to check if a user has skipped or approved income yet
    variables={{
      incomeAction: ['USER_PENDING', 'SKIPPED', 'APPROVED'],
      rewardStatus: 'INITIAL',
    }}
  >
    {({ loading, error, data }) => {
      if (error) Log.error(error);

      const healthExitOrigin = access(
        data,
        'viewer.health.information.exitStage',
      );
      const didEnroll = access(data, 'viewer.health.information.didEnroll');
      const healthExitState = `ENROLL_${didEnroll}`;
      const healthRecID = access(data, 'viewer.health.recommendation.id');
      const healthInsID = access(data, 'viewer.health.insurance.id');
      const isHealthCovered =
        access(data, 'viewer.health.recommendation.importance') === 'COVERED';

      const taxGoal = access(data, 'viewer.taxGoal');
      const retirementGoal = access(data, 'viewer.retirementGoal');
      const ptoGoal = access(data, 'viewer.ptoGoal');
      const incomeTransactions = access(data, 'viewer.incomeTransactions');

      const workType = access(data, 'viewer.user.workType');
      const givenName = access(data, 'viewer.user.givenName');
      const kycStatus = access(data, 'viewer.user.kycSavings.status');
      const kycNeeded = access(data, 'viewer.user.kycSavings.needed');

      const documentUploads = access(data, 'viewer.documentUploads');

      const needsIDV = requiresIDV(kycNeeded, documentUploads);

      const needsAddress =
        kycStatus === 'KYC_REVIEW' &&
        Array.isArray(kycNeeded) &&
        kycNeeded.includes('KYC_ADDRESS');

      // the syncStatus of the user's primary Account
      const syncStatus = access(
        data,
        'viewer.primaryAccount.bankLink.syncStatus',
      );
      const primaryBank = access(data, 'viewer.primaryAccount.bankLink.bank');
      const bankLinks = access(data, 'viewer.bankLinks');
      const lastBankLinkUpdate = access(
        data,
        'viewer.primaryAccount.bankLink.lastUpdated',
      );
      const bankLinkID = access(data, 'viewer.primaryAccount.bankLink.id');

      const hasFinishedSurvey = access(data, 'viewer.survey.hasFinished');

      Log.debug(lastBankLinkUpdate);

      // breakdown of which goal is active. We'll need to loop better for
      // custom goals
      const hasTaxGoal = !!taxGoal && !isDraft(taxGoal);
      const hasPTOGoal = !!ptoGoal && !isDraft(ptoGoal);
      const hasRetirementGoal = !!retirementGoal && !isDraft(retirementGoal);

      // At least one goal is active but account might not be ready
      const hasGoals = hasTaxGoal || hasPTOGoal || hasRetirementGoal;

      const hasReadyTaxGoal = hasTaxGoal && isAccountReady(taxGoal);
      const hasReadyPtoGoal = hasPTOGoal && isAccountReady(ptoGoal);
      const hasReadyRetirementGoal =
        hasRetirementGoal && isAccountReady(retirementGoal);

      const hasNoReadyGoals =
        !hasReadyTaxGoal && !hasReadyPtoGoal && !hasReadyRetirementGoal;

      const allGoalsPaused =
        isPaused(taxGoal) && isPaused(ptoGoal) && isPaused(retirementGoal);

      // User has linked their bank though might not be done setting up goals
      const hasNotifications =
        !!incomeTransactions && incomeTransactions.length > 0;

      const pendingRewards = access(data, 'viewer.pendingRewards');
      const hasPendingRewards =
        Array.isArray(pendingRewards) && pendingRewards.length > 0;
      // There should not be more than one for this use case
      // unless the user is already sending referal codes around without having set up
      // any plans
      const rewardAmount = hasPendingRewards && pendingRewards[0].amount;

      // No active goal but did start on at least one plan
      const startedPlan =
        !hasGoals &&
        ((!!taxGoal && isDraft(taxGoal)) ||
          (!!retirementGoal && isDraft(retirementGoal)) ||
          (!!ptoGoal && isDraft(ptoGoal)) ||
          hasNotifications);

      const isAccountLocked = access(
        data,
        'viewer.savingsAccountMetadata.isAccountLocked',
      );
      const isSavingsAccountReady =
        !isAccountLocked &&
        access(data, 'viewer.savingsAccountMetadata.isAccountReady');

      const isPlanProcessing = !isSavingsAccountReady;

      let notifications = [],
        hiddenNotifications = 0;
      if (hasNotifications) {
        const numOfTxs = incomeTransactions.filter(
          tx => tx.status === 'INCOME_ACTION_USER_PENDING',
        ).length;

        for (let i = 0; i < numOfTxs; i++) {
          // We filter as a precaution since updating the cache can leave transactions
          // with other status in this list
          if (incomeTransactions[i].status === 'INCOME_ACTION_USER_PENDING') {
            const account = getAccount(
              bankLinks,
              incomeTransactions[i].accountID,
            );
            notifications = notifications.concat([
              {
                id: incomeTransactions[i].id,
                amount: incomeTransactions[i].amount,
                date: incomeTransactions[i].date,
                status: incomeTransactions[i].status,
                description: incomeTransactions[i].description,
                account: account.bankName || '',
              },
            ]);
            // Only show the 3 most recent transactions if goals are not set up yet
            if ((!hasGoals || isPlanProcessing) && i === 2) {
              if (numOfTxs > 3) {
                hiddenNotifications = numOfTxs - 3;
              }
              break;
            }
          }
        }
      }

      let surveyStatus = null;
      if (hasGoals && !hasFinishedSurvey) {
        surveyStatus = 'LEGACY_NO_SURVEY';
      } else if (!hasFinishedSurvey) {
        surveyStatus = 'NO_SURVEY';
      }

      let status;

      if (isAccountLocked) {
        status = 'LOCKED_OUT';
      } else if (syncStatus === 'LOGIN_ERROR') {
        status = 'BANKLINK_LOGIN_ERROR';
      } else if (needsIDV) {
        status = 'NEEDS_IDV';
      } else if (hasPendingRewards && hasNoReadyGoals) {
        status = 'PENDING_REWARD_NO_GOALS';
        // Makes sure we don't show the card anymore althought backend should be updating that
      } else if (hasPendingRewards && !hasPTOGoal) {
        status = 'PENDING_REWARD';
      } else if (startedPlan) {
        status = 'PLAN_STARTED';
      } else if (!hasGoals) {
        status = 'NO_PLAN';
      } else if (isPlanProcessing) {
        status = 'PLAN_PROCESSING';
      } else if (surveyStatus === null && !hasNotifications) {
        status = 'NO_NOTIFICATIONS';
        // Read above to understand this nonsense
      } else if (surveyStatus === null && notifications.length === 0) {
        status = 'EMPTY';
      } else if (allGoalsPaused) {
        status = 'ALL_GOALS_PAUSED';
        // Legacy no survey shows a card to get users to the checkup
      } else {
        status = 'NOTIFICATIONS';
      }
      Log.debug(status);

      return children({
        loading,
        error,
        status,
        surveyStatus,
        primaryBank,
        bankLinkID,
        lastBankLinkUpdate,
        notifications,
        hiddenNotifications,
        rewardAmount,
        workType,
        givenName,
        hasFinishedSurvey,
        healthExitState,
        healthExitOrigin,
        isHealthCovered,
        healthRecID,
        healthInsID,
      });
    }}
  </Query>
);

export default HomeStatus;
