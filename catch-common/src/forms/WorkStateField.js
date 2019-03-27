import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { Dropdown, InfoTooltip } from '@catch/rio-ui-kit';
import { stateItems } from '@catch/utils';

const PREFIX = 'catch.user.WorkStateField';
export const COPY = {
  placeholder: <FormattedMessage id={`${PREFIX}.placeholder`} />,
  label: <FormattedMessage id={`${PREFIX}.label`} />,
  info: <FormattedMessage id={`${PREFIX}.tooltip`} />,
};

export const WorkStateField = ({
  white,
  hideTooltip,
  intl: { formatMessage },
}) => (
  <Field
    white={white}
    name="workState"
    qaName="workState"
    component={Dropdown}
    items={stateItems}
    placeholder={formatMessage({
      id: `${PREFIX}.placeholder`,
    })}
    label={COPY['label']}
    extraLabel={!hideTooltip && <InfoTooltip body={COPY['info']} />}
  />
);

const withReduxForm = reduxForm();
const enhance = compose(
  injectIntl,
  withReduxForm,
);
const Component = enhance(WorkStateField);

Component.displayName = 'WorkStateField';

export default Component;
