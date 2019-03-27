import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import { AccountList } from '../components';

const AccountSelectForm = ({ accounts, breakpoints }) => (
  <Field
    name="accountSelected"
    component={AccountList}
    accounts={accounts}
    breakpoints={breakpoints}
  />
);

AccountSelectForm.propTypes = {
  accounts: PropTypes.array,
};

export default reduxForm({ form: 'accountSelectForm' })(AccountSelectForm);
