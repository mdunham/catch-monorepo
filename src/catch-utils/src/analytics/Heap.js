import React from 'react';
import PropTypes from 'prop-types';
import Heap from 'react-heap';

import Env from '../env';
import { createLogger } from '../logger';

const Log = createLogger('initialize-heap');

const InitializeHeap = ({ userId, userData }) => {
  return Env.isProd ? (
    <Heap appId="789979166" userId={userId} userData={userData} />
  ) : null;
};

InitializeHeap.propTypes = {
  userId: PropTypes.string.isRequired,
  userData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};

export default InitializeHeap;
