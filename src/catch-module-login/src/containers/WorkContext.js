import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import access from 'safe-access';

import { UpdateWorkType } from '@catch/common';

import { WorkTypeForm, WorkInfoForm } from '../forms';
import { LoadingIndicator } from '../components';

export const UPDATE_WORK_CONTEXT = gql`
  mutation UpdateW2Context(
    $incomeInput: SetIncomeInput!
    $incomeStateInput: SetIncomeStateInput!
    $spouseIncomeInput: SetSpouseIncomeInput!
    $filingStatusInput: FilingStatus!
    $employerInput: UpdateUserInput!
  ) {
    setIncome(input: $incomeInput) {
      estimatedIncome
    }
    setIncomeState(input: $incomeStateInput)
    setFilingStatus(input: $filingStatusInput)
    setSpouseIncome(input: $spouseIncomeInput)
    updateUser(input: $employerInput) {
      employment {
        employerName
      }
    }
  }
`;

/**
 * This container applies any workType change logic over 2 phases:
 * 1) mutate the workType
 * @param {String} workType
 * 2) mutate the work context
 * @param {Object} incomeInput
 * W2 or mixed
 * @param {String} incomeInput.estimatedW2Income
 * 1099 or mixed
 * @param {String} incomeInput.estimated1099Income
 * @param {Object} incomeStateInput
 * @param {String} incomeStateInput.state
 * @param {String} filingStatusInput
 * married status
 * @param {Object} spouseIncomeInput
 * @param {String} spouseIncomeInput.estimatedIncome
 * W2 or mixed
 * @param {Object} employerInput
 * @param {String} employerInput.employment.employerName
 * This can be optimized to be reused in any workType update situation
 */
const WorkContext = ({
  updatedWorkType,
  viewport,
  onWorkTypeUpdated,
  onContextUpdated,
  workType: existingWorkType,
}) => (
  <UpdateWorkType onCompleted={onWorkTypeUpdated}>
    {({ mutateWorkType, loading: workTypeLoading, error, workType }) => {
      return workTypeLoading ? (
        <LoadingIndicator />
      ) : updatedWorkType ? (
        <Mutation mutation={UPDATE_WORK_CONTEXT} onCompleted={onContextUpdated}>
          {(mutateWorkContext, { loading, error }) =>
            loading ? (
              <LoadingIndicator />
            ) : (
              <WorkInfoForm
                onSubmit={values =>
                  mutateWorkContext({
                    variables: {
                      incomeInput: {
                        estimated1099Income: values.estimated1099Income,
                        estimatedW2Income: values.estimatedW2Income,
                      },
                      incomeStateInput: {
                        state: values.workState,
                      },
                      spouseIncomeInput: {
                        estimatedIncome: values.spouseIncome,
                      },
                      filingStatusInput: values.filingStatus,
                      employerInput: {
                        employment: {
                          employerName: values.employerName,
                        },
                      },
                    },
                  })
                }
                workType={workType || existingWorkType}
                viewport={viewport}
              />
            )
          }
        </Mutation>
      ) : (
        <WorkTypeForm
          onSubmit={values =>
            mutateWorkType({
              variables: { userWorkTypeInput: { workType: values.workType } },
            })
          }
          viewport={viewport}
        />
      );
    }}
  </UpdateWorkType>
);

WorkContext.propTypes = {
  updatedWorkType: PropTypes.bool,
  viewport: PropTypes.string,
  onWorkTypeUpdated: PropTypes.func,
  onContextUpdated: PropTypes.func,
  residenceState: PropTypes.string,
};

export default WorkContext;
