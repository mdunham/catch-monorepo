import React, { Component } from 'react';
import { object, bool, oneOfType } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Stepper, Divider, Box, Text, Button } from '@catch/rio-ui-kit';
import { Percentage } from '@catch/utils';

const PREFIX = 'catch.module.plan.EditPlanForm';
export const COPY = {
  taxLabel: <FormattedMessage id={`${PREFIX}.taxLabel`} />,
  retirementLabel: <FormattedMessage id={`${PREFIX}.retirementLabel`} />,
  plannedTargetLabel: <FormattedMessage id={`${PREFIX}.plannedTargetLabel`} />,
  unplannedTargetLabel: (
    <FormattedMessage id={`${PREFIX}.unplannedTargetLabel`} />
  ),
  ptoBreakdownDescription: values => (
    <FormattedMessage
      id={`${PREFIX}.ptoBreakdownDescription`}
      values={values}
    />
  ),
};

export class EditPlanForm extends Component {
  static propTypes = {
    goals: object.isRequired,
    formValues: object,
    ptoCalculations: oneOfType([object, bool]),
    initialValues: object.isRequired,
  };
  render() {
    const { goals, formValues, initialValues, ptoCalculations } = this.props;
    return (
      <Box>
        {goals.tax && (
          <Box>
            <Box mb={1} justify="center">
              <Box mb={1}>
                <Text weight="medium">{COPY['taxLabel']}</Text>
              </Box>
              <Field
                name="taxPercentage"
                qaName="taxPercentage"
                format={v => Math.round(v * 100)}
                parse={v => v / 100}
                component={props => {
                  return (
                    <Stepper {...props}>
                      <Percentage whole>
                        {formValues
                          ? formValues.taxPercentage
                          : initialValues.taxPercentage}
                      </Percentage>
                    </Stepper>
                  );
                }}
              />
            </Box>
            {(goals.pto || goals.retirement) && <Divider />}
          </Box>
        )}
        {goals.retirement && (
          <Box>
            <Box my={1} mt={2} justify="center">
              <Box mb={1}>
                <Text weight="medium">{COPY['retirementLabel']}</Text>
              </Box>
              <Field
                name="retirementPercentage"
                qaName="retirementPercentage"
                format={v => Math.round(v * 100)}
                parse={v => v / 100}
                component={props => {
                  return (
                    <Stepper {...props}>
                      <Percentage whole>
                        {formValues
                          ? formValues.retirementPercentage
                          : initialValues.retirementPercentage}
                      </Percentage>
                    </Stepper>
                  );
                }}
              />
            </Box>
            {goals.pto && <Divider />}
          </Box>
        )}
        {goals.pto && (
          <Box>
            <Box my={1} mt={2} justify="center">
              <Box mb={1}>
                <Text weight="medium">{COPY['plannedTargetLabel']}</Text>
              </Box>
              <Field
                white
                name="plannedTarget"
                qaName="plannedTarget"
                component={Stepper}
                // extraLabel={COPY['ptoBreakdownDescription']({ percentage: Math.round(
                //   ptoCalculations.plannedPaycheckPercentage * 100})}
                extraLabel={`This is about ${Math.round(
                  ptoCalculations.plannedPaycheckPercentage * 100,
                )}% of your paycheck.`}
                inlineLabel="days"
                textWidth={100}
              />
            </Box>
            <Divider />
            <Box my={1} mt={2} justify="center">
              <Box mb={1}>
                <Text weight="medium">{COPY['unplannedTargetLabel']}</Text>
              </Box>
              <Field
                white
                name="unplannedTarget"
                qaName="unplannedTarget"
                component={Stepper}
                extraLabel={`This is about ${Math.round(
                  ptoCalculations.unplannedPaycheckPercentage * 100,
                )}% of your paycheck.`}
                inlineLabel="days"
                textWidth={100}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

export default reduxForm({
  form: 'EditPlanForm',
  enableReinitialize: true,
})(EditPlanForm);
