import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { Platform } from 'react-native';

import { Box, Text, Label, ReduxInput, InfoTooltip } from '@catch/rio-ui-kit';
import { formatSSN, Env } from '@catch/utils';

const PREFIX = 'catch.plans.SocialOccupationForm';
export const COPY = {
  info: <FormattedMessage id="catch.user.SSNTooltip" />,
  caption: <FormattedMessage id={`${PREFIX}.ssn.caption`} />,
  showSSN: <FormattedMessage id={`catch.PasswordField.showPw`} />,
  hideSSN: <FormattedMessage id={`catch.PasswordField.hidePw`} />,
};

export class SSNField extends React.Component {
  static defaultProps = {
    alert: false,
  };

  state = {
    showSSN: false,
  };

  toggleSSN = () => {
    this.setState({ showSSN: !this.state.showSSN });
  };

  render() {
    const {
      intl: { formatMessage },
      white,
      onEnter,
      socialSaved,
      ssn,
      alert,
    } = this.props;
    const { showSSN } = this.state;

    return socialSaved ? (
      <Box mb={3}>
        <Label mb={1}>{formatMessage({ id: `${PREFIX}.ssn.label` })}</Label>
        <Text weight="medium">
          <Text size={22}>•••</Text> <Text size={18}> - </Text>{' '}
          <Text size={22}>••</Text> <Text size={18}> - </Text>{' '}
          <Text>{ssn}</Text>
        </Text>
        <Text size="small">{COPY['caption']}</Text>
      </Box>
    ) : (
      <Box align="flex-start">
        <Field
          grouped
          white={white}
          name="ssn"
          qaName="ssn"
          component={ReduxInput}
          placeholder={formatMessage({ id: `${PREFIX}.ssn.placeholder` })}
          label={formatMessage({ id: `${PREFIX}.ssn.label` })}
          format={formatSSN}
          onSubmit={onEnter}
          alert={alert}
          confirmable={false}
          keyboardType={Env.isNative ? 'number-pad' : undefined}
          extraLabel={
            <Text
              ml={4}
              onClick={this.toggleSSN}
              color="link"
              size="small"
              weight="medium"
            >
              {showSSN ? COPY['hideSSN'] : COPY['showSSN']}
            </Text>
          }
          type={showSSN ? 'text' : 'password'}
          icon="gray-lock"
          className="_lr-hide"
          showError={false}
        />
        <Text size="small">{COPY['caption']}</Text>
      </Box>
    );
  }
}

const withReduxForm = reduxForm();

const enhance = compose(
  injectIntl,
  withReduxForm,
);

const Component = enhance(SSNField);

Component.displayName = 'SSNField';

export default Component;
