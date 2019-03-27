import React from 'react';

import CheckKYC from './CheckKYC';
import UpdateUser from './UpdateUser';
import { PlanDisclosuresView } from '../views';

const CheckEligibility = props => (
  <CheckKYC>
    {kycProps => (
      <UpdateUser>
        {updateUserProps => (
          <PlanDisclosuresView {...kycProps} {...updateUserProps} {...props} />
        )}
      </UpdateUser>
    )}
  </CheckKYC>
);

export default CheckEligibility;
