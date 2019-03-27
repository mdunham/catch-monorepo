import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { occupationItems } from '@catch/utils';
import { Dropdown } from '@catch/rio-ui-kit';

const PREFIX = 'catch.user.OccupationField';

export const OccupationField = ({ white, intl: { formatMessage } }) => (
  <Field
    id="occupation"
    name="occupation"
    component={Dropdown}
    items={occupationItems}
    placeholder={formatMessage({
      id: `${PREFIX}.placeholder`,
    })}
    label={formatMessage({ id: `${PREFIX}.label` })}
    white={white}
  />
);

const withReduxForm = reduxForm();

const enhance = compose(injectIntl, withReduxForm);
const Component = enhance(OccupationField);

Component.displayName = 'OccupationField';

export default Component;
