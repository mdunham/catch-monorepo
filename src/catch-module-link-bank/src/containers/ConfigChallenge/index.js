import React from 'react';

import ConfigInstructions from './ConfigInstructions';
import ConfigChallenge from './ConfigChallenge';

const ConfigError = props => (
  <ConfigInstructions bankLinkId={props.bankLinkId}>
    {({ loading, error, instructions }) => (
      <ConfigChallenge
        {...props}
        instructions={instructions}
        loading={loading}
        error={error}
      />
    )}
  </ConfigInstructions>
);

export default ConfigError;
