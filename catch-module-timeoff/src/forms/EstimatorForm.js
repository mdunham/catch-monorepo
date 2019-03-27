import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Button, Stepper, Box, Text } from '@catch/rio-ui-kit';
import { createValidator, pto } from '@catch/utils';

import { formName } from '../const';
const PREFIX = 'catch.module.timeoff.EstimatorForm';
export const COPY = {
  'plannedTargetInput.label': (
    <FormattedMessage id={`${PREFIX}.plannedTargetInput.label`} />
  ),
  'plannedTargetInput.caption': (
    <FormattedMessage id={`${PREFIX}.plannedTargetInput.caption`} />
  ),
  'unplannedTargetInput.label': (
    <FormattedMessage id={`${PREFIX}.unplannedTargetInput.label`} />
  ),
  'unplannedTargetInput.caption': (
    <FormattedMessage id={`${PREFIX}.unplannedTargetInput.caption`} />
  ),
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
};

class TimeOffEstimatorForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    hasSubmit: PropTypes.bool,
  };
  static defaultProps = {
    hasSubmit: false,
  };

  render() {
    const { hasSubmit, handleSubmit, validationError } = this.props;
    return (
      <Box mt={2}>
        <Text size={16} weight="medium">
          {COPY['plannedTargetInput.label']}
        </Text>
        <Field
          white
          name="plannedTarget"
          parse={v => parseInt(v, 10)}
          component={Stepper}
          disableMax={!!validationError}
          extraLabel={COPY['plannedTargetInput.caption']}
        />

        <Box my={2}>
          <Text size={16} weight="medium">
            {COPY['unplannedTargetInput.label']}
          </Text>
          <Field
            white
            name="unplannedTarget"
            parse={v => parseInt(v, 10)}
            component={Stepper}
            disableMax={!!validationError}
            extraLabel={COPY['unplannedTargetInput.caption']}
          />
        </Box>

        {hasSubmit && (
          <Box justify="flex-end">
            <Button onClick={handleSubmit}>{COPY['submitButton']}</Button>
          </Box>
        )}
      </Box>
    );
  }
}

export default reduxForm({
  form: formName,
  validate: createValidator(pto),
  enableReinitialize: true,
})(TimeOffEstimatorForm);
