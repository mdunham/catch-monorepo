import gql from 'graphql-tag';

import { client } from '@catch/apollo';
import { Auth, createLogger } from '@catch/utils';

const Log = createLogger('hubspot-tracking');

// const CURRENT_USER = gql`
//   query GetCurrentUser {
//     viewer {
//       user {
//         id
//         givenName
//         familyName
//         email
//         dob
//       }
//     }
//   }
// `;

// export function fetchCurrentUser() {
//   return client.query({ query: CURRENT_USER });
// }

export async function getUserEmail() {
  let attributes;

  try {
    const user = await Auth.currentProviderUser();
    attributes = await Auth.getUserAttributes(user);
  } catch (e) {
    Log.error(e);
  }

  Log.debug(attributes);
  return attributes.email;
}

// for now, wer're only using contact property endpoints in hubspot. we'd have to refactor this in order to handle different hubspot endpoints

// const hubspotEndpoints = {
//   // https://developers.hubspot.com/docs/methods/contacts/create_or_update
//   CREATE_OR_UPDATE: 'contacts/v1/contact/createOrUpdate/email/',
// };

const HUBSPOT_POST = gql`
  mutation postToHubspot($endpoint: String!, $payload: String!) {
    hubspotPost(endpoint: $endpoint, json: $payload)
  }
`;

export async function postToHubspot({ endpoint, payload }) {
  try {
    const email = await getUserEmail();
    const _endpoint = `contacts/v1/contact/createOrUpdate/email/${email}`;

    const response = await client.mutate({
      mutation: HUBSPOT_POST,
      variables: {
        endpoint: _endpoint,
        payload: JSON.stringify({ properties: [...payload] }),
      },
    });

    Log.info(`tracked hubspot event ${email}`);

    return response;
  } catch (e) {
    Log.error(e);
  }
}

// example payload for reference
// const payload = [
//   {
//     property: 'firstname',
//     value: givenName,
//   },
//   {
//     property: 'lastname',
//     value: familyName,
//   },
//   {
//     property: 'employment_status',
//     value: WORK_TYPES[workType],
//   },
// ];
