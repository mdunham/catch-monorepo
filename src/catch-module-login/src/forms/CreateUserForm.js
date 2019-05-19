import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  H2,
  Text,
  ReduxInput,
  Link,
  Divider,
  ReduxCheckbox,
  Fine,
  Button,
  InfoTooltip,
  ExpandCollapser,
} from '@catch/rio-ui-kit';
import {
  DobField,
  LegalFirstNameField,
  LegalLastNameField,
  ResidenceStateField,
} from '@catch/common';
import {
  PasswordValidation,
  formatDate,
  formatNoSpaces,
  createValidator,
  createUserForm,
} from '@catch/utils';
import { Header, UsCitizenTooltip } from '../components';

const formName = 'CreateUserForm';
const PREFIX = 'catch.module.login.RegisterForm';
export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  'offerCode.label': <FormattedMessage id={`${PREFIX}.offerCode.label`} />,
  'offerCode.caption': <FormattedMessage id={`${PREFIX}.offerCode.caption`} />,
  'offerCode.tooltip': <FormattedMessage id={`${PREFIX}.offerCode.tooltip`} />,
  showOfferCode: <FormattedMessage id={`${PREFIX}.showOfferCode`} />,
  isUsCitizen: <FormattedMessage id={`${PREFIX}.isUsCitizen`} />,
  'isUsCitizen.infoTrigger': (
    <FormattedMessage id={`${PREFIX}.isUsCitizen.infoTrigger`} />
  ),
  'isUsCitizen.infoText': (
    <FormattedMessage id={`${PREFIX}.isUsCitizen.infoText`} />
  ),
  'disclosureEsign--bbva': componentId => (
    <FormattedMessage
      id={`${PREFIX}.disclosureEsign--bbva`}
      values={{
        link: (
          <Link
            to="/disclosures/communication-transfer"
            componentId={componentId}
            newTab
          >
            Electronic Communication and Transfers Agreement
          </Link>
        ),
      }}
    />
  ),
  disclosure1: componentId => (
    <FormattedMessage
      id={`${PREFIX}.disclosure1`}
      values={{
        link1: (
          <Link to="/disclosures/terms" componentId={componentId} newTab>
            Terms of Use
          </Link>
        ),
        link2: (
          <Link
            to="/disclosures/privacy-policy"
            componentId={componentId}
            newTab
          >
            Privacy Policy
          </Link>
        ),
      }}
    />
  ),
  disclosure2: <FormattedMessage id={`${PREFIX}.disclosure2`} />,
};

export class CreateUserForm extends React.PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    invalid: PropTypes.bool.isRequired,
    componentId: PropTypes.string.isRequired,
  };
  static defaultProps = {
    initialValues: {},
  };
  state = {
    showOfferCodeInput: false,
  };

  showOfferCode = () => {
    this.setState({ showOfferCodeInput: true });
  };

  render() {
    const {
      initialValues,
      handleSubmit,
      name,
      invalid,
      viewport,
      componentId,
    } = this.props;
    const {
      showPw,
      isPWFocused,
      showOfferCodeInput,
      isUsCitizen,
      agreeEsign,
    } = this.state;
    return (
      <React.Fragment>
        <Header
          title={COPY['title']({ name })}
          subtitle={COPY['subtitle']}
          viewport={viewport}
        />
        <Box row={viewport !== 'PhoneOnly'}>
          <Box w={[null, 1 / 2, 1 / 2]} pr={[null, 1, 1]} screen={viewport}>
            <LegalFirstNameField form={formName} onEnter={this.handleEnter} />
          </Box>
          <Box w={[null, 1 / 2, 1 / 2]} pl={[null, 1, 1]} screen={viewport}>
            <LegalLastNameField form={formName} onEnter={this.handleEnter} />
          </Box>
        </Box>
        <Box w={160}>
          <DobField form={formName} onEnter={this.handleEnter} />
        </Box>
        <Box mb={32} w={160}>
          {showOfferCodeInput || initialValues.signupCode ? (
            <Field
              name="signupCode"
              component={ReduxInput}
              label={[
                COPY['offerCode.label'],
                ' ',
                <Text size="small" color="ash">
                  {COPY['offerCode.caption']}
                </Text>,
              ]}
              extraLabel={<InfoTooltip body={COPY['offerCode.tooltip']} />}
              confirmable={false}
            />
          ) : (
            <Text
              size="small"
              color="link"
              weight="medium"
              onClick={this.showOfferCode}
            >
              {COPY['showOfferCode']}
            </Text>
          )}
        </Box>
        <Box mb={3}>
          <Field
            name="isUsCitizen"
            component={ReduxCheckbox}
            qaName="isUsCitizen"
          >
            {COPY['isUsCitizen']}
            <UsCitizenTooltip
              trigger={COPY['isUsCitizen.infoTrigger']}
              body={COPY['isUsCitizen.infoText']}
            />
          </Field>
        </Box>
        <Box mb={5}>
          <Field
            name="agreeEsign"
            component={ReduxCheckbox}
            qaName="agreeEsign"
          >
            {COPY['disclosureEsign--bbva'](componentId)}
          </Field>
        </Box>
        <Box row justify="flex-end">
          <Button
            disabled={invalid}
            onClick={handleSubmit}
            style={viewport === 'PhoneOnly' ? { width: '100%' } : undefined}
          >
            {COPY['submitButton']}
          </Button>
        </Box>
        <Divider
          mt={4}
          mb={1}
          style={{ opacity: 1, backgroundColor: '#D7D9DE' }}
        />
        <Text size="small" color="gray2" mb={2}>
          {COPY['disclosure1'](componentId)}
        </Text>
        <Text size="small" color="gray2">
          {COPY['disclosure2']}
        </Text>
      </React.Fragment>
    );
  }
}

export default reduxForm({
  form: formName,
  validate: createValidator(createUserForm),
})(CreateUserForm);
