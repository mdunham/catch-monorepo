import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@catch/rio-ui-kit';
import CommonBank, { commonBanks } from '../CommonBank';

function CommonBanks({ onClick }) {
  return (
    <Box w="100%" wrap row style={{ zIndex: -1 }} justify="space-around">
      {commonBanks.map((b, i) => (
        <CommonBank
          key={`${i}-${b.id}`}
          id={b.id}
          altText={b.name}
          logoSrc={b.imageUrl}
          onClick={onClick}
        />
      ))}
    </Box>
  );
}

CommonBanks.propTypes = {
  onClick: PropTypes.func,
};

export default CommonBanks;
