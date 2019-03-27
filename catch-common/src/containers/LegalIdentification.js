import React from 'react';
import PropTypes from 'prop-types';

import LegalIdentificationModule from './LegalIdentificationModule';
import { Spinner, Box } from '@catch/rio-ui-kit';
import { Error } from '@catch/errors';

import { LegalLabel } from '../components';

/**
 * Esists as well in module-me
 * TODO: hoist to a util-legal mmodule
 *
 */

// LegalIdentification provides a sensible default rendering layer with the
// ability to override the render func if need be in various use cases.
export function LegalIdentification(props) {
  return (
    <LegalIdentificationModule
      render={({ error, loading, legalName, dob }) => {
        if (loading) {
          return <Spinner />;
        } else if (error) {
          return <Error>{error}</Error>;
        } else {
          return (
            <Box row>
              <Box mb={2} w={1 / 2}>
                <LegalLabel label="Legal Name">{legalName}</LegalLabel>
              </Box>

              <Box mb={3} w={1 / 2}>
                <LegalLabel label="Date of Birth">{dob}</LegalLabel>
              </Box>
            </Box>
          );
        }
      }}
      {...props}
    />
  );
}

LegalIdentification.propTypes = {
  render: PropTypes.func,
};

export default LegalIdentification;
