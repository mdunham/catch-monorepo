import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Text, ReduxInput, ExpandCollapser } from '@catch/rio-ui-kit';
import { PasswordValidation, formatNoSpaces } from '@catch/utils';

const PREFIX = 'catch.PasswordField';
export const COPY = {
  showPw: <FormattedMessage id={`${PREFIX}.showPw`} />,
  hidePw: <FormattedMessage id={`${PREFIX}.hidePw`} />,
  firstPwLabel: <FormattedMessage id={`${PREFIX}.firstPwLabel`} />,
  changePwLabel: <FormattedMessage id={`${PREFIX}.changePwLabel`} />,
};

export class PasswordField extends React.PureComponent {
  static propTypes = {
    // How it relates to the usage e.i. change password
    rel: PropTypes.string,
    // Passed by redux form wrapper and used for validation
    form: PropTypes.string,
    white: PropTypes.bool,
  };
  static defaultProps = {
    rel: 'first',
  };
  state = {
    showPw: false,
    isPwFocused: false,
  };
  togglePw = () => {
    this.setState(({ showPw }) => ({
      showPw: !showPw,
    }));
  };
  toggleFocus = () => {
    this.setState(({ isPwFocused }) => ({
      isPwFocused: !isPwFocused,
    }));
  };
  render() {
    const { form, rel, white, onSubmit } = this.props;
    const { showPw, isPwFocused } = this.state;
    const fieldName = rel === 'change' ? 'newPassword' : 'password';
    return (
      <React.Fragment>
        <Field
          id={fieldName}
          name={fieldName}
          qaName={fieldName}
          component={ReduxInput}
          format={formatNoSpaces}
          type={showPw ? 'text' : 'password'}
          label={COPY[`${rel}PwLabel`]}
          onSubmit={this.handleEnter}
          onFocus={this.toggleFocus}
          onBlur={this.toggleFocus}
          showError={
            false
            /*@NOTE we don't show errors since that's what the pw validation below is for */
          }
          grouped
          extraLabel={
            <Text
              onClick={this.togglePw}
              color="link"
              size="small"
              weight="medium"
            >
              {showPw ? COPY['hidePw'] : COPY['showPw']}
            </Text>
          }
          autoComplete="new-password"
          white={white}
          onSubmit={onSubmit}
        />
        <ExpandCollapser height={138} isOpen={isPwFocused}>
          <PasswordValidation formName={form} fieldName={fieldName} />
        </ExpandCollapser>
      </React.Fragment>
    );
  }
}

const Component = reduxForm()(PasswordField);

Component.displayName = 'PasswordField';

export default Component;
