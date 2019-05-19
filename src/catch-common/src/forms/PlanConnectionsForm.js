import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';

import { styles, withDimensions } from '@catch/rio-ui-kit';

import TaxDependentField from './TaxDependentField';
import TrustedContactField from './TrustedContactField';

export const PlanConnectionsForm = ({
  breakpoints,
  form,
  hasRetirementGoal,
  hasTaxGoal,
  hasTrustedContact,
  isTrustedContact,
}) => (
  <React.Fragment>
    {hasTaxGoal && <TaxDependentField breakpoints={breakpoints} form={form} />}
    {((hasRetirementGoal && !hasTrustedContact) || isTrustedContact) && (
      <View style={styles.get(hasTaxGoal && 'TopGutter')}>
        <TrustedContactField breakpoints={breakpoints} form={form} />
      </View>
    )}
  </React.Fragment>
);

PlanConnectionsForm.propTypes = {
  form: PropTypes.string,
  breakpoints: PropTypes.object,
  hasRetiremntGoal: PropTypes.bool,
  isTrustedContact: PropTypes.bool,
  hasTrustedContact: PropTypes.bool,
};

PlanConnectionsForm.defaultProps = {
  form: 'ContactForm',
};

const withReduxForm = reduxForm({
  form: 'ContactForm',
  destroyOnUnmount: false,
  enableReinitialize: true,
});

const enhance = compose(
  withDimensions,
  withReduxForm,
);

export default enhance(PlanConnectionsForm);
