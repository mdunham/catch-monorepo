import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('recommendations');

export const RECOMMENDATIONS = gql`
  query Recommendations {
    viewer {
      user {
        id
        workType
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
          isInterested
          isActedOn
          reason
        }
      }
      taxGoal {
        id
        status
        paycheckPercentage
        availableBalance
      }
      ptoGoal {
        id
        status
        paycheckPercentage
        availableBalance
      }
      retirementGoal {
        id
        status
        paycheckPercentage
        wealthAccount {
          balance
        }
      }
      health {
        insurance {
          id
          carrier
        }
        doctors {
          id
          name
        }
      }
    }
  }
`;

function isContributing(status) {
  return status === 'ACTIVE' || status === 'PAUSED';
}
function isPaused(status) {
  return status === 'PAUSED';
}
function is1099(wt) {
  return wt === 'WORK_TYPE_1099';
}
function isRecommended(importance) {
  return /VITAL|IMPORTANT/.test(importance);
}

export function formatRec(rec, recMap, hasTaxRateUpdates, workType) {
  // We override the importance of recommendations with current goal status
  const statusMap = {
    ACTIVE: 'CONTRIBUTING',
    PAUSED: 'PAUSED',
  };
  /**
   * ======================= Plan Updates ==================================
   * Sometimes when recommendations come back we take a look at their current
   * plan state and make some suggestions on how to update it
   * =======================================================================
   * 1) If a plan is currently paused and comes back as recommended we add an
   * update to the list
   * 2) If the tax contribution rate changes based on updated income we add that
   * in here too
   * 3) We usually pause the tax plan automatically in case they change to W2
   * however we could also nudge them to pause their time off as well
   * TODO when I have time
   */
  if (recMap[rec.type] && isContributing(recMap[rec.type].status)) {
    const updates = [];
    if (
      isPaused(recMap[rec.type].status) &&
      isRecommended(rec.needBasedImportance) &&
      !rec.isActedOn
    ) {
      updates.push({
        recId: rec.id,
        planType: rec.type,
        view: 'UnpausePlanView',
      });
    }
    if (hasTaxRateUpdates && rec.type === 'PLANTYPE_TAX' && !rec.isActedOn) {
      updates.push({
        recId: rec.id,
        planType: rec.type,
        view: 'AdjustTaxesView',
      });
    }
    return {
      ...rec,
      importance: statusMap[recMap[rec.type].status],
      contribution: recMap[rec.type].contribution,
      balance: recMap[rec.type].balance,
      disabled: rec.type === 'PLANTYPE_TAX' && workType === 'WORK_TYPE_W2',
      updates,
    };
  }
  // Flag existing verticals so we can redirect to the plan flow
  // or capture interest instead
  if (!recMap[rec.type]) {
    return {
      ...rec,
      comingSoon: true,
    };
  }
  // If the user is W2 we disable the Tax vertical but we still show it
  if (rec.type === 'PLANTYPE_TAX' && workType === 'WORK_TYPE_W2') {
    return {
      ...rec,
      disabled: true,
    };
  }
  // Health plan has different type of metadata
  if (rec.type === 'PLANTYPE_HEALTH') {
    return {
      ...rec,
      ...recMap[rec.type],
    };
  }
  return rec;
}

const Recommendations = ({ children, hasTaxRateUpdates }) => (
  <Query query={RECOMMENDATIONS}>
    {({ loading, error, data }) => {
      const get = access(data);

      const hasFinished = get('viewer.survey.hasFinished');
      const recs = get('viewer.latestRecommendations.recommendations') || [];
      const workType = get('viewer.user.workType');

      //Data from live verticals we want to pass to each recommendation
      const verticals = {
        PLANTYPE_TAX: {
          status: get('viewer.taxGoal.status'),
          contribution: get('viewer.taxGoal.paycheckPercentage'),
          balance: get('viewer.taxGoal.availableBalance'),
        },
        PLANTYPE_PTO: {
          status: get('viewer.ptoGoal.status'),
          contribution: get('viewer.ptoGoal.paycheckPercentage'),
          balance: get('viewer.ptoGoal.availableBalance'),
        },
        PLANTYPE_RETIREMENT: {
          status: get('viewer.retirementGoal.status'),
          contribution: get('viewer.retirementGoal.paycheckPercentage'),
          balance: get('viewer.retirementGoal.wealthAccount.balance') || 0,
        },
        PLANTYPE_HEALTH: {
          carrier: get('viewer.health.insurance.carrier'),
          doctors: get('viewer.health.doctors') || [],
        },
      };

      const formatVertical = rec =>
        formatRec(rec, verticals, hasTaxRateUpdates, workType);

      const list = recs.map(formatVertical);

      Log.debug(list);

      return children({
        hasFinished,
        list,
        loading,
        error,
      });
    }}
  </Query>
);

export default Recommendations;
