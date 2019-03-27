import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { ReduxRadioGroup, OptionCard, Box, Button } from '@catch/rio-ui-kit';
import { WorkTypeField } from '@catch/common';
import { createValidator, workTypeForm } from '@catch/utils';

import { Header } from '../components';

const formName = 'WorkTypeForm';
const PREFIX = 'catch.module.login.WorkTypeForm';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
};

export const WorkTypeForm = ({ viewport, handleSubmit, invalid }) => (
  <React.Fragment>
    <Header
      title={COPY['title']}
      subtitle={COPY['subtitle']}
      viewport={viewport}
    />
    <WorkTypeField form={formName} />
    <Box row justify="flex-end" mt={3}>
      <Button
        disabled={invalid}
        onClick={handleSubmit}
        wide={viewport === 'PhoneOnly'}
      >
        {COPY['submitButton']}
      </Button>
    </Box>
  </React.Fragment>
);

export default reduxForm({
  form: formName,
  validate: createValidator(workTypeForm),
})(WorkTypeForm);
