import { client } from '@catch/apollo';
import gql from 'graphql-tag';

const CURRENT_USER = gql`
  query GetCurrentUser {
    viewer {
      user {
        id
        givenName
        familyName
        email
        dob
        workType
      }
      taxGoal {
        id
      }
      retirementGoal {
        id
      }
      ptoGoal {
        id
        plannedTarget
        unplannedTarget
      }
    }
  }
`;

const BANKS = gql`
  query SearchBanks($search: String, $limit: Int) {
    banks(search: $search, limit: $limit) {
      id
      name
      usernameText
      passwordText
      notes
    }
  }
`;

const CREATE_USER = gql`
  mutation createUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      givenName
      familyName
      email
      dob
      workType
    }
  }
`;

const USER_METADATA = gql`
  mutation updateUserMetadata(
    $incomeInput: SetIncomeInput!
    $incomeStateInput: SetIncomeStateInput!
    $spouseIncomeInput: SetSpouseIncomeInput!
    $filingStatusInput: FilingStatus!
    $userInput: UpdateUserInput!
  ) {
    setIncome(input: $incomeInput) {
      estimated1099Income
      estimatedW2Income
    }
    setIncomeState(input: $incomeStateInput)
    setFilingStatus(input: $filingStatusInput)
    setSpouseIncome(input: $spouseIncomeInput)
    updateUser(input: $userInput) {
      workType
      employment {
        employerName
      }
    }
  }
`;

// Used to confirm user actually exists in our system
const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    viewer {
      user {
        id
        dob
        givenName
        familyName
        email
        filingStatus
        workType
        employment {
          employerName
        }
      }
      incomeState
      income {
        estimatedIncome
      }
      spouseIncome
    }
  }
`;

const VALIDATE_CODE = gql`
  mutation validateSignupCode($code: String!) {
    validateCode(code: $code) {
      valid
      reward {
        amount
        description
      }
    }
  }
`;

const HUBSPOT_POST = gql`
  mutation postToHubspot($endpoint: String!, $payload: String!) {
    hubspotPost(endpoint: $endpoint, json: $payload)
  }
`;

const DELETE_PUSH_TOKEN = gql`
  mutation DeletePushToken($id: ID!) {
    deletePushToken(id: $id)
  }
`;

export function checkUserExists() {
  return client.query({ query: IS_AUTHENTICATED, fetchPolicy: 'network-only' });
}

export function fetchCurrentUser() {
  return client.query({ query: CURRENT_USER });
}

export function fetchBanks() {
  return client.query({ query: BANKS, variables: { search: '', limit: 10 } });
}

export function createUser({ givenName, familyName, email, dob, signupCode }) {
  return client.mutate({
    mutation: CREATE_USER,
    variables: {
      input: {
        givenName,
        familyName,
        email,
        dob,
        signupCode,
      },
    },
  });
}

export function updateUserMetadata({
  workType,
  workState,
  estimated1099Income,
  estimatedW2Income,
  spouseIncome,
  filingStatus,
  employerName,
}) {
  return client.mutate({
    mutation: USER_METADATA,
    variables: {
      userInput: {
        workType,
        employment: {
          employerName,
        },
      },
      incomeInput: {
        estimated1099Income,
        estimatedW2Income,
      },
      incomeStateInput: {
        state: workState,
      },
      filingStatusInput: filingStatus,
      spouseIncomeInput: {
        estimatedIncome: spouseIncome,
      },
    },
  });
}

export function validateCode({ signupCode }) {
  return client.mutate({
    mutation: VALIDATE_CODE,
    variables: {
      code: signupCode,
    },
  });
}

export function deletePushToken({ tokenId }) {
  return client.mutate({
    mutation: DELETE_PUSH_TOKEN,
    variables: {
      id: tokenId,
    },
  });
}
