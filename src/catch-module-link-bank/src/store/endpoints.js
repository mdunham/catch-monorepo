import { client } from '@catch/apollo';
import gql from 'graphql-tag';

//@NOTE: Adding that here for now
const BANK_LINKS = gql`
  query HasBankLinked {
    viewer {
      bankLinks {
        id
      }
    }
  }
`;

const CREATE_LINK = gql`
  mutation CreateBankLogin($link: CreateBankLinkRequest!) {
    createBankLink(input: $link) {
      id
      username
      balance
      syncStatus
      configInstructions
    }
  }
`;

const UPDATE_LINK = gql`
  mutation UpdateBankLink($link: UpdateBankLinkRequest!) {
    updateBankLink(input: $link) {
      id
      username
      syncStatus
    }
  }
`;

const SET_PRIMARY = gql`
  mutation SetPrimaryAccount($input: SetPrimaryAccountInput!) {
    setPrimaryAccount(input: $input) {
      id
      name
      accountNumber
    }
  }
`;

const SEARCH = gql`
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

const GET_BANK = gql`
  query GetBank($id: ID) {
    banks(id: $id) {
      id
      name
      usernameText
      passwordText
      notes
    }
  }
`;

export function getBank({ id }) {
  return client
    .query({
      query: GET_BANK,
      variables: {
        id,
      },
    })
    .then(({ data: { banks } }) => banks[0]);
}

export function createBankLink({ username, password, bankId }) {
  return client
    .mutate({
      mutation: CREATE_LINK,
      variables: {
        link: {
          username,
          password,
          bankId,
        },
      },
      update: (proxy, { data: { createBankLink: { id, ...traits } } }) => {
        // Ensure that bank link routes will let users through once they have a
        // bank link.  TODO: This doesn't check that the bank link was
        // successful though... might need to do a check on mount that they have
        // a valid and completed bank link.
        const data = proxy.readQuery({ query: BANK_LINKS });
        data.viewer.bankLinks.push({ id, __typename: 'BankLink', ...traits });
        proxy.writeQuery({ query: BANK_LINKS, data });
      },
    })
    .then(({ data: { createBankLink } }) => createBankLink);
}

export function updateBankLink({ bankLinkId, username, password }) {
  return client
    .mutate({
      mutation: UPDATE_LINK,
      variables: {
        link: {
          id: bankLinkId,
          username,
          password,
        },
      },
    })
    .then(({ data: { updateBankLink } }) => updateBankLink);
}

export function searchBanks({ search, limit }) {
  return client
    .query({
      query: SEARCH,
      variables: {
        search,
        limit,
      },
    })
    .then(({ data: { banks } }) => banks);
}

export function setPrimaryAccount({ accountId }) {
  return client
    .mutate({
      mutation: SET_PRIMARY,
      variables: {
        input: {
          accountId,
          isPrimary: true,
        },
      },
    })
    .then(({ data: { setPrimaryAccount } }) => setPrimaryAccount);
}
