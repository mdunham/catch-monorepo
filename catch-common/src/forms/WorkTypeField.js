import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { ReduxRadioGroup, OptionCard } from '@catch/rio-ui-kit';
import { WORK_TYPES_DESCRIPTIONS } from '@catch/utils';

export const WorkTypeField = props => (
  <Field name="workType" component={ReduxRadioGroup}>
    {Object.keys(WORK_TYPES_DESCRIPTIONS).map((wt, i) => (
      <OptionCard
        radio
        title={WORK_TYPES_DESCRIPTIONS[wt].title}
        subtitle={WORK_TYPES_DESCRIPTIONS[wt].subtitle}
        value={wt}
        mb={1}
        key={`wt-${i}`}
      />
    ))}
  </Field>
);

const Component = reduxForm()(WorkTypeField);

Component.displayName = 'WorkTypeField';

export default Component;
