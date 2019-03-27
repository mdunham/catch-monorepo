import React from 'react';
import PropTypes from 'prop-types';

import { P, Label } from '@catch/rio-ui-kit';

/**
 * Esists as well in module-me
 * TODO: hoist to a util-legal mmodule
 *
 */

const LegalLabel = ({ label, children }) => (
  <React.Fragment>
    <Label color="subtle">{label}</Label>
    <P weight="medium">{children}</P>
  </React.Fragment>
);

LegalLabel.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default LegalLabel;
