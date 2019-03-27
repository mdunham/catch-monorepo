import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { Dropdown } from '@catch/rio-ui-kit';
import { relationshipItems } from '@catch/utils';

const PREFIX = 'catch.user.RelationshipField';

export const RelationshipField = ({ white, intl: { formatMessage } }) => (
  <Field
    id="relation"
    name="relation"
    qaName="relation"
    items={relationshipItems}
    component={Dropdown}
    placeholder={formatMessage({
      id: `${PREFIX}.placeholder`,
    })}
    label={formatMessage({ id: `${PREFIX}.label` })}
    white={white}
  />
);

const withReduxForm = reduxForm();

const enhance = compose(
  injectIntl,
  withReduxForm,
);
const Component = enhance(RelationshipField);

Component.displayName = 'RelationshipField';

export default Component;
