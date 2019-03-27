import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  Text,
  ReduxRadioGroup,
  Radio,
  Divider,
  Icon,
} from '@catch/rio-ui-kit';

const PREFIX = 'catch.plans.RegulatoryForm';
export const COPY = {
  yes: <FormattedMessage id={`${PREFIX}.yes`} />,
  no: <FormattedMessage id={`${PREFIX}.no`} />,
  isPoliticallyExposed: (
    <FormattedMessage id={`${PREFIX}.isPoliticallyExposed`} />
  ),
  isControlPerson: <FormattedMessage id={`${PREFIX}.isControlPerson`} />,
  isFirmAffiliated: <FormattedMessage id={`${PREFIX}.isFirmAffiliated`} />,
};

export const RegulatoryForm = ({
  isControlPerson,
  isFirmAffiliated,
  isPoliticallyExposed,
}) => (
  <React.Fragment>
    <Box mt={4} row>
      <Box mr={3} flex={1}>
        <Icon name="flag" size={54} />
      </Box>
      <Box flex={5}>
        <Text mb={2}>{COPY['isControlPerson']}</Text>
        <Field name="isControlPerson" component={ReduxRadioGroup} row>
          <Radio
            value={true}
            qaName="isControlPerson--true"
            checked={isControlPerson === true}
            label={
              <Text weight="medium" ml={1} mr={4}>
                {COPY['yes']}
              </Text>
            }
          />
          <Radio
            value={false}
            qaName="isControlPerson--false"
            checked={isControlPerson === false}
            label={
              <Text weight="medium" ml={1} mr={4}>
                {COPY['no']}
              </Text>
            }
          />
        </Field>
        <Divider mt={4} />
      </Box>
    </Box>
    <Box mt={4} row>
      <Box mr={3} flex={1}>
        <Icon name="suitcase" size={44} />
      </Box>
      <Box flex={5}>
        <Text mb={2}>{COPY['isFirmAffiliated']}</Text>
        <Field name="isFirmAffiliated" component={ReduxRadioGroup} row>
          <Radio
            value={true}
            qaName="isFirmAffiliated--true"
            checked={isFirmAffiliated === true}
            label={
              <Text weight="medium" ml={1} mr={4}>
                {COPY['yes']}
              </Text>
            }
          />
          <Radio
            value={false}
            qaName="isFirmAffiliated--false"
            checked={isFirmAffiliated === false}
            label={
              <Text weight="medium" ml={1} mr={4}>
                {COPY['no']}
              </Text>
            }
          />
        </Field>
        <Divider mt={4} />
      </Box>
    </Box>
    <Box my={4} row>
      <Box mr={3} flex={1}>
        <Icon name="reports" size={44} />
      </Box>
      <Box flex={5}>
        <Text mb={2}>{COPY['isPoliticallyExposed']}</Text>
        <Field name="isPoliticallyExposed" component={ReduxRadioGroup} row>
          <Radio
            value={true}
            qaName="isPoliticallyExposed--true"
            checked={isPoliticallyExposed === true}
            label={
              <Text weight="medium" ml={1} mr={4}>
                {COPY['yes']}
              </Text>
            }
          />
          <Radio
            value={false}
            qaName="isPoliticallyExposed--false"
            checked={isPoliticallyExposed === false}
            label={
              <Text weight="medium" ml={1} mr={4}>
                {COPY['no']}
              </Text>
            }
          />
        </Field>
      </Box>
    </Box>
  </React.Fragment>
);

RegulatoryForm.propTypes = {
  isControlPerson: PropTypes.bool,
  isFirmAffiliated: PropTypes.bool,
  isPoliticallyExposed: PropTypes.bool,
};

const formName = 'RegulatoryForm';

const selector = formValueSelector(formName);

const withForm = reduxForm({
  form: formName,
});

const withFormValues = connect(state => ({
  isControlPerson: selector(state, 'isControlPerson'),
  isFirmAffiliated: selector(state, 'isFirmAffiliated'),
  isPoliticallyExposed: selector(state, 'isPoliticallyExposed'),
}));

const enhance = compose(
  withForm,
  withFormValues,
);

export default enhance(RegulatoryForm);
