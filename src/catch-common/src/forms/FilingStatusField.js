import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { Dropdown, InfoTooltip, Link } from '@catch/rio-ui-kit';
import {
  createValidator,
  updateFilingStatusForm,
  filingStatusItems as filingStatus,
} from '@catch/utils';

const PREFIX = 'catch.user.FilingStatusField';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
  placeholder: <FormattedMessage id={`${PREFIX}.placeholder`} />,
  info: values => <FormattedMessage id={`${PREFIX}.tooltip`} values={values} />,
};

export const FilingStatusField = ({ white, intl: { formatMessage } }) => (
  <Field
    white={white}
    name="filingStatus"
    qaName="filingStatus"
    component={Dropdown}
    items={filingStatus.items.map(value => ({
      value,
      label: formatMessage({ id: `${filingStatus.PREFIX}.${value}` }),
    }))}
    placeholder={formatMessage({
      id: `${PREFIX}.placeholder`,
    })}
    label={COPY['label']}
    extraLabel={
      <InfoTooltip
        body={COPY['info']({
          link: (
            <Link
              to="https://help.catch.co/setting-up-tax-withholding/what-is-my-filing-status"
              newTab
            >
              this article
            </Link>
          ),
        })}
      />
    }
  />
);

const withReduxForm = reduxForm({
  validate: createValidator(updateFilingStatusForm),
});
const enhance = compose(
  injectIntl,
  withReduxForm,
);
const Component = enhance(FilingStatusField);

Component.displayName = 'FilingStatusField';

export default Component;
