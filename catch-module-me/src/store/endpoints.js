import gql from 'graphql-tag';
import { client } from '@catch/apollo';

export const PAYCHECK_HISTORY = gql`
  query PaycheckHistory($incomeAction: [IncomeAction!]) {
    viewer {
      incomeTransactions(incomeAction: $incomeAction) {
        id
        amount
        date
        status
        description
        transferAmount
      }
    }
  }
`;

export const UPDATE_USER_EMAIL = gql`
  mutation UpdateUserEmail($userInput: UpdateUserInput!) {
    updateUser(input: $userInput) {
      email
    }
  }
`;

export const VIEWER_EMAIL = gql`
  query ViewerEmail {
    viewer {
      user {
        id
        email
      }
    }
  }
`;

export function updateUserEmail({ email }) {
  return client.mutate({
    mutation: UPDATE_USER_EMAIL,
    variables: {
      userInput: {
        email,
      },
    },
    refetchQueries: [{ query: VIEWER_EMAIL }],
  });
}
