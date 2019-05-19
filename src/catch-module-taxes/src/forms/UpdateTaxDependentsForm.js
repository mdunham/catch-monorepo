import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Text, View } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles } from '@catch/rio-ui-kit';

import TaxDependentCardField from './TaxDependentCardField';

const formName = 'UpdateTaxDependentsForm';

const PREFIX = 'catch.module.taxes.UpdateTaxDependentsForm';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
};

export const UpdateTaxDependentsForm = ({
  breakpoints,
  unaccountedTaxDependents,
  taxDependents,
}) => (
  <View style={styles.get('TopGutter')}>
    {taxDependents &&
      taxDependents.map((td, idx) => (
        <TaxDependentCardField
          key={`tdcf-${idx}`}
          breakpoints={breakpoints}
          form={formName}
          hideDivider={
            unaccountedTaxDependents > 0
              ? false
              : idx === taxDependents.length - 1
          }
          {...td}
        />
      ))}
  </View>
);

UpdateTaxDependentsForm.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  unAccountedTaxDependents: PropTypes.number,
  taxDependents: PropTypes.array.isRequired,
};

const withRedux = reduxForm({
  form: formName,
});
const Component = withRedux(UpdateTaxDependentsForm);
Component.displayName = formName;

export default Component;
