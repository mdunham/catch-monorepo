import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Component from './Component';
import access from 'safe-access';
import { format, capitalize } from '@catch/utils';

const ID = gql`
  query LegalIdentification {
    viewer {
      user {
        id
        givenName
        familyName
        dob
      }
    }
  }
`;

const withIdentification = graphql(ID, {
  props: ({ ownProps, data: { loading, error, viewer } }) => {
    const safeViewer = access(viewer);
    return {
      loading,
      error,
      legalName: `${capitalize(safeViewer('user.givenName'))} ${capitalize(
        safeViewer('user.familyName'),
      )}`,
      dob: format(safeViewer('user.dob'), 'MM/DD/YYYY'),
    };
  },
});

export default withIdentification(Component);
