import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Stepper, Box, FeatureTooltip, Text, Link } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.taxes.EstimatorForm';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.numDependentsInput.label`} />,
  infoText: values => (
    <FormattedMessage
      id={`${PREFIX}.numDependentsInput.infoText`}
      values={values}
    />
  ),
};

export const DependentsForm = () => (
  <Box mb={3} row>
    <Box>
      <Box row mb={1} align="center">
        <Text size={16} weight="medium" mr={1}>
          {COPY['label']}
        </Text>
        <FeatureTooltip>
          <Text size={18} weight="bold" mb={1}>
            {COPY['label']}
          </Text>
          <Text>
            {COPY['infoText']({
              link: (
                <Link
                  newTab
                  to="https://help.catch.co/setting-up-tax-withholding/who-qualifies-as-a-dependent"
                >
                  read more
                </Link>
              ),
            })}
          </Text>
        </FeatureTooltip>
      </Box>
      <Field
        white
        extraLabel="A qualifying child or relative"
        qaName="numDependents"
        name="numDependents"
        parse={v => parseInt(v, 10)}
        component={Stepper}
      />
    </Box>
  </Box>
);

export default reduxForm({
  form: 'TaxGoal',
})(DependentsForm);
