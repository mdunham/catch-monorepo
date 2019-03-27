import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import access from 'safe-access';

import { Box, H2, Text, Figure, colors, Spinner } from '@catch/rio-ui-kit';
import { createLogger, goTo, navigationPropTypes, Env } from '@catch/utils';
import {
  RegisterForm,
  CreateUserForm,
  ConfirmationCodeForm,
  WorkInfoForm,
  WorkTypeForm,
} from '../forms';
import * as sel from '../store/selectors';
import { onboardingSteps as steps, actions } from '../store/duck';
import {
  WaitlistConfirmation,
  OnboardingLayout,
  LoadingIndicator,
  OnboardingInfo,
} from '../components';
import SidebarAccordion from '../components/SidebarAccordion';
import { WorkContext } from '../containers';
import WelcomeScreen from './WelcomeScreen';

const Log = createLogger('signup:view');

export class OnboardingView extends React.PureComponent {
  static propTypes = {
    step: PropTypes.string,
    size: PropTypes.string,
    userContext: PropTypes.object.isRequired,
    isProcessing: PropTypes.bool,
    // Redux functions called by submitting the different forms
    checkAuthStatus: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    confirmUser: PropTypes.func.isRequired,
    saveUserInfo: PropTypes.func.isRequired,
    completedUser: PropTypes.func.isRequired,
    completedWorkType: PropTypes.func.isRequired,
    ...navigationPropTypes,
  };
  _browserWarning;
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  componentDidMount() {
    if (!this.props.step) {
      // This makes sure we're always in the correct state
      this.props.checkAuthStatus();
    }
    // Avoids keeping it in the state
    const signupCode = access(this.props, 'location.state.refCode');
    if (signupCode) {
      this.props.cacheSignupCode(signupCode);
    }
  }

  componentDidUpdate(prevProps) {
    const { step } = this.props;
    if (step !== prevProps.step && step === steps.INFO && !Env.isWarning) {
      this.removeWarning();
    }
  }

  handleWarning = e => {
    e.returnValue = '';
    return '';
  };

  /**
   * We add a browser warning when the user has started filling the screening form
   */
  setWarning = (values, dispatch, props, previousValues) => {
    if (
      Object.keys(values).length > 0 &&
      !this._browserWarning &&
      !Env.isNative
    ) {
      window.addEventListener('beforeunload', this.handleWarning);
      this._browserWarning = true;
      Log.debug('setting browser warning');
    }
  };

  removeWarning = () => {
    if (!Env.isNative) {
      window.removeEventListener('beforeunload', this.handleWarning);
      this._browserWarning = false;
    }
  };

  handleExit = () => {
    this.props.authenticate({});
    this.goTo(['/']);
    Log.debug('exiting');
  };

  render() {
    const { step, userContext, isProcessing } = this.props;

    return !step ? (
      <LoadingIndicator />
    ) : step === steps.COMPLETE ? (
      <WelcomeScreen
        givenName={userContext.givenName}
        onContinue={this.handleExit}
      />
    ) : step === steps.INFO && isProcessing ? (
      <LoadingIndicator step={step} />
    ) : (
      <OnboardingLayout
        step={step}
        sidebar={<SidebarAccordion sections={OnboardingInfo} />}
      >
        {this.renderForm}
      </OnboardingLayout>
    );
  }

  /**
   * We want to avoid using withDimensions hoc too much so we
   * pass the viewport very deep in the tree to enable responsiveness
   */
  renderForm = viewport => {
    const {
      step,
      error,
      userContext: { email, workType },
      registerUser,
      createUser,
      confirmUser,
      isProcessing,
      signupCode,
      completedUser,
      completedWorkType,
      componentId,
    } = this.props;

    if (isProcessing) {
      return <LoadingIndicator step={step} />;
    }

    switch (step) {
      case steps.CREATE:
        return (
          /** Submit triggers a saga that will create the user in our database
           * @param {Object} payload
           * @param {string} payload.email
           * @param {string} payload.password
           * @param {string} payload.dob
           * @param {string} payload.signupCode
           */
          <CreateUserForm
            componentId={componentId}
            viewport={viewport}
            onSubmit={createUser}
            initialValues={{ signupCode }}
          />
        );
      case steps.CONFIRM:
        /** Submit triggers a saga that will confirm the user in cognito
         * and create the user in our db
         * @param {string} payload.code
         */
        return (
          <ConfirmationCodeForm
            viewport={viewport}
            submitError={error}
            onSubmit={confirmUser}
            emailAddress={email}
          />
        );
      case steps.INFO:
      case steps.WORKTYPE:
        /**
         * Submits are handled directly by specific mutation components,
         * the provided callbacks update the redux store to change the navigation
         */
        return (
          <WorkContext
            viewport={viewport}
            updatedWorkType={step === steps.INFO}
            onWorkTypeUpdated={({ updateUser }) =>
              completedWorkType({ workType: updateUser.workType })
            }
            onContextUpdated={completedUser}
            workType={workType}
          />
        );
      case steps.REGISTER:
      default:
        /** Submit triggers a saga that will send the fields to hubspot
         * @param {Object} payload
         * @param {string} payload.email
         * @param {string} payload.familyName
         * @param {string} payload.givenName
         * @param {string} payload.workType
         */
        return (
          <RegisterForm
            onChange={this.setWarning}
            viewport={viewport}
            onSubmit={registerUser}
          />
        );
    }
  };
}

const withRedux = connect(
  createStructuredSelector({
    step: sel.getSignupStep,
    userContext: sel.getUserContext,
    isProcessing: sel.getIsProcessing,
    error: sel.getAuthError,
    signupCode: sel.getSignupCode,
  }),
  actions,
);

export default withRedux(OnboardingView);
