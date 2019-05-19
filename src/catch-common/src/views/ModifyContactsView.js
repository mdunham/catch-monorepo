import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getFormValues, getFormSyncErrors } from 'redux-form';
import { Platform, View, KeyboardAvoidingView } from 'react-native';
import { push } from 'react-router-redux';
import access from 'safe-access';

import { withDimensions, styles } from '@catch/rio-ui-kit';
import {
  calculateTaxes,
  createLogger,
  goTo,
  precisionRound,
} from '@catch/utils';
import { toastActions } from '@catch/errors';

import { EditInfoLayout } from '../components';
import { ContactsQuery, UpdateTaxGoal } from '../containers';

import AddContactView from './AddContactView';
import AdjustTaxesView from './AdjustTaxesView';
import ContactDetailsView from './ContactDetailsView';
import DeleteContactView from './DeleteContactView';
import EditContactView from './EditContactView';

const Log = createLogger('modify-contact-view');

export class ModifyContactsView extends React.Component {
  constructor(props) {
    super(props);

    this.goTo = goTo.bind(this);

    this.state = {
      action: props.action,
      isTaxDependent: null,
      isTrustedContact: null,
      currentContact: null,
      confirmationStage: null,
      isConfirming: false,
      isChangingTaxDependentsNumber: null,
      isChangingTrustedContact: null,
      toasts: [],
    };
  }

  /**
   * Adds toasts to the toasts queue
   */
  pushToast = toast => {
    let { toasts } = this.state;

    toasts.push(toast);

    this.setState({
      toasts: toasts,
    });
  };

  /**
   * pops all toasts in state
   */
  popToasts = () => {
    const { popToast } = this.props;
    const { toasts } = this.state;

    !!toasts && toasts.forEach(tst => popToast(tst));
  };

  /**
   * Handles dismissing modal / navigating back to wherever
   */
  handleDismiss = () => {
    this.popToasts();

    Platform.select({
      web: this.props.onDismiss && this.props.onDismiss(),
      default: this.goTo('/me/people'),
    });
  };

  /**
   * helper to set action
   */
  handleAction = action => {
    this.setState({ action: action });
  };

  handleTaxRecc = (
    numDependents,
    {
      estimatedIncome,
      incomeState,
      spouseIncome,
      filingStatus,
      paycheckPercentage,
    },
  ) => {
    const CALCULATIONS = calculateTaxes({
      state: incomeState,
      filingStatus: filingStatus,
      grossIncome: estimatedIncome,
      spouseIncome: spouseIncome,
      numExemptions: 0,
      numDependents: numDependents,
    });

    const reccPercentage = access(CALCULATIONS, 'roundedPaycheckPercentage');

    return {
      reccPercentage,
      hasChanged: reccPercentage !== paycheckPercentage,
      CALCULATIONS,
    };
  };

  render() {
    const {
      breakpoints,
      formValues,
      formSyncErrors,
      contactId,
      initialValues,
      ...rest
    } = this.props;

    const { action } = this.state;

    const saveRule =
      !!formValues &&
      !!formSyncErrors &&
      !formSyncErrors.givenName &&
      !formSyncErrors.familyName &&
      !formSyncErrors.relation &&
      (!!formValues.isTrustedContact ? !formSyncErrors.email : true) &&
      (!!formValues.isTrustedContact
        ? formValues.phoneNumber && formValues.phoneNumber.length >= 12
        : true);

    return (
      <ContactsQuery>
        {({
          // if a user has a retirement goal
          hasRetirementGoal,

          // if a user has a tax goal
          hasTaxGoal,

          // if a user has a trusted contact
          hasTrustedContact,

          // list of contacts
          contacts,

          // the number of dependents on the user's taxGoal
          numDependents,

          // the user's filing status
          filingStatus,

          // the user's spouse's income
          spouseIncome,

          // the user's estimated income
          estimatedIncome,

          // the user's income state
          incomeState,

          // the number of contacts who are connected as tax dependents
          connectedDependents,
        }) => {
          // the contact being CRUDded
          const currentContact =
            contacts && contacts.find(contact => contactId === contact.id);

          switch (action) {
            case 'ADJUST_TAXES':
              return (
                <AdjustTaxesView
                  dependents
                  onCancel={this.handleDismiss}
                  onCompleted={data => {
                    this.pushToast({
                      type: 'success',
                      title: 'Contribution updated for tax withholding',
                      msg: `Setting aside ${precisionRound(
                        data.rate * 100,
                        2,
                      )}% of each paycheck.`,
                    });

                    this.handleDismiss();
                  }}
                  push={this.props.push}
                />
              );

            case 'DELETE_CONTACT':
              return (
                <UpdateTaxGoal>
                  {({ upsertTaxGoal, saving }) => (
                    <DeleteContactView
                      breakpoints={breakpoints}
                      numDependents={numDependents}
                      onDismiss={this.handleDismiss}
                      thisContact={currentContact}
                      upsertTaxGoal={upsertTaxGoal}
                      connectedDependents={connectedDependents}
                      hasTaxGoal={hasTaxGoal}
                      pushToast={this.pushToast}
                      toggleTaxAdjustment={() =>
                        this.setState({ action: 'ADJUST_TAXES' })
                      }
                      calcTaxes={num =>
                        this.handleTaxRecc(num, {
                          estimatedIncome,
                          spouseIncome,
                          filingStatus,
                          incomeState,
                        })
                      }
                    />
                  )}
                </UpdateTaxGoal>
              );

            case 'VIEW_CONTACT':
              return (
                <EditInfoLayout
                  breakpoints={breakpoints}
                  onClose={this.handleDismiss}
                >
                  <ContactDetailsView
                    breakpoints={breakpoints}
                    onEdit={() => this.handleAction('UPDATE_CONTACT')}
                    {...currentContact}
                  />
                </EditInfoLayout>
              );

            case 'UPDATE_CONTACT':
              return (
                <UpdateTaxGoal>
                  {({ upsertTaxGoal }) => (
                    <EditContactView
                      formValues={formValues}
                      breakpoints={breakpoints}
                      hasTaxGoal={hasTaxGoal}
                      hasRetirementGoal={hasRetirementGoal}
                      hasTrustedContact={hasTrustedContact}
                      numDependents={numDependents}
                      onDismiss={this.handleDismiss}
                      pushToast={this.pushToast}
                      saveRule={saveRule}
                      upsertTaxGoal={upsertTaxGoal}
                      thisContact={currentContact}
                      connectedDependents={connectedDependents}
                      toggleTaxAdjustment={() =>
                        this.setState({ action: 'ADJUST_TAXES' })
                      }
                      toggleDelete={() =>
                        this.setState({ action: 'DELETE_CONTACT' })
                      }
                      calcTaxes={num =>
                        this.handleTaxRecc(num, {
                          estimatedIncome,
                          spouseIncome,
                          filingStatus,
                          incomeState,
                        })
                      }
                    />
                  )}
                </UpdateTaxGoal>
              );

            case 'ADD_CONTACT':
              return (
                <UpdateTaxGoal>
                  {({ upsertTaxGoal }) => (
                    <AddContactView
                      initialValues={initialValues}
                      formValues={formValues}
                      breakpoints={breakpoints}
                      hasTaxGoal={hasTaxGoal}
                      hasRetirementGoal={hasRetirementGoal}
                      hasTrustedContact={hasTrustedContact}
                      numDependents={numDependents}
                      onDismiss={this.handleDismiss}
                      pushToast={this.pushToast}
                      saveRule={saveRule}
                      upsertTaxGoal={upsertTaxGoal}
                      connectedDependents={connectedDependents}
                      toggleTaxAdjustment={() =>
                        this.setState({ action: 'ADJUST_TAXES' })
                      }
                      calcTaxes={num =>
                        this.handleTaxRecc(num, {
                          estimatedIncome,
                          spouseIncome,
                          filingStatus,
                          incomeState,
                        })
                      }
                    />
                  )}
                </UpdateTaxGoal>
              );
            default:
              return null;
          }
        }}
      </ContactsQuery>
    );
  }
}

ModifyContactsView.propTypes = {
  action: PropTypes.string.isRequired,
  breakpoints: PropTypes.object.isRequired,
  onDismiss: PropTypes.func,
};

const withRedux = connect(
  state => ({
    formValues: getFormValues('ContactForm')(state),
    formSyncErrors: getFormSyncErrors('ContactForm')(state),
  }),
  {
    popToast: toastActions.popToast,
    push,
  },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

const Component = enhance(ModifyContactsView);
Component.displayName = 'ModifyContactsView';

export default Component;
