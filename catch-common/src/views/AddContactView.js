import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { createLogger } from '@catch/utils';

import { EditInfoLayout } from '../components';
import { AddContact, LinkContact } from '../containers';
import ContactConfirmView from './ContactConfirmView';
import HandleContactView from './HandleContactView';

const Log = createLogger('add-contact-view');

const PREFIX = 'catch.module.plans.AddContactView';
export const COPY = {};

export class AddContactView extends React.Component {
  static propTypes = {
    breakpoints: PropTypes.object.isRequired,
    calcTaxes: PropTypes.func,
    formValues: PropTypes.object,
    hasTaxGoal: PropTypes.bool,
    hasRetirementGoal: PropTypes.bool,
    hasTrustedContact: PropTypes.bool,
    numDependents: PropTypes.number,
    onDismiss: PropTypes.func.isRequired,
    pushToast: PropTypes.func.isRequired,
    upsertTaxGoal: PropTypes.func.isRequired,
  };

  state = { currentContact: null, isConfirming: false };

  /**
   * handler for figuring out the numDependents the tax goal should change to
   */

  determineNumDependentsChange = () => {
    const { connectedDependents, formValues, numDependents } = this.props;
    const { proposedValues } = this.state;

    // solves issue where tax dep change could get out of whack
    // basically, the numDependents on tax goal and number of contacts designated can get out of sync
    // so set the base value for future calculations accordingly
    let proposedDependents =
      numDependents === connectedDependents
        ? numDependents
        : connectedDependents;

    const cc = formValues || proposedValues;

    if (cc && cc.isTaxDependent) {
      proposedDependents = proposedDependents + 1;
    }

    return proposedDependents;
  };

  /**
   * Saves the new contact to the db
   *
   *  @param {function} addContact - the save contact mutation
   */
  handleSave = addContact => {
    const { currentContact } = this.state;
    const { formValues } = this.props;

    const cc = formValues || currentContact;

    addContact({
      variables: {
        contactDetails: {
          givenName: cc.givenName,
          familyName: cc.familyName,
          email: cc.email,
          phoneNumber: cc.phoneNumber,
          relation: cc.relation,
        },
      },
    });
  };

  /**
   * Links the new contact to tax and/or retirement
   *
   * @param {function} linkContact - the linkContact mutation
   * @param {string} id - the contact record's id
   */
  handleLinking = (linkContact, id) => {
    const { currentContact } = this.state;
    const {
      calcTaxes,
      connectedDependents,
      formValues,
      hasTaxGoal,
      numDependents,
      onDismiss,
      pushToast,
      toggleTaxAdjustment,
      upsertTaxGoal,
    } = this.props;

    const cc = formValues || currentContact;

    !!cc.isTaxDependent &&
      linkContact({ variables: { id: id, type: 'TAX_DEPENDENT' } });
    !!cc.isTrustedContact &&
      linkContact({
        variables: { id: id, type: 'RETIREMENT_TRUSTED_CONTACT' },
      });

    let message = '';

    if (cc.isTrustedContact && cc.isTaxDependent) {
      message = `${
        cc.givenName
      } is listed as a dependent for Tax Withholding and your trusted contact for Retirement.`;
    } else if (cc.isTrustedContact) {
      message = `${
        cc.givenName
      } is listed as your trusted contact for Retirement.`;
    } else if (cc.isTaxDependent) {
      message = `${cc.givenName} is listed as a dependent for Tax Withholding.`;
    } else {
      message = `${
        cc.givenName
      } is now available as a contact in People & Family.`;
    }

    pushToast({
      title: `${cc.givenName} ${cc.familyName} is now connected to your plan`,
      msg: message,
      type: 'success',
    });

    const txv = hasTaxGoal && calcTaxes(this.determineNumDependentsChange());

    Log.debug(txv);

    if (this.determineNumDependentsChange() <= connectedDependents) {
      upsertTaxGoal({
        variables: {
          input: {
            numDependents: this.determineNumDependentsChange(),
          },
        },
      });

      if (txv && txv.hasChanged) {
        toggleTaxAdjustment();
      } else {
        onDismiss();
      }
    } else {
      onDismiss();
    }
  };

  render() {
    const { currentContact, isConfirming } = this.state;
    const {
      breakpoints,
      hasTaxGoal,
      hasRetirementGoal,
      hasTrustedContact,
      formValues,
      onDismiss,
      saveRule,
      initialValues,
    } = this.props;

    return (
      <LinkContact isChangingTaxDepStatus={this.state.isChangingTaxDepStatus}>
        {({ linkContact }) => (
          <AddContact
            onCompleted={data =>
              this.handleLinking(linkContact, data.addContact.id)
            }
          >
            {({ addContact, loading }) => (
              <EditInfoLayout
                breakpoints={breakpoints}
                onClose={onDismiss}
                title={
                  isConfirming
                    ? `${currentContact.givenName} ${currentContact.familyName}`
                    : 'Creating a new contact'
                }
                actions={
                  isConfirming
                    ? [
                        {
                          text: 'Edit',
                          onPress: () => this.setState({ isConfirming: false }),
                        },
                        {
                          text: 'Create contact',
                          onPress: () => this.handleSave(addContact),
                        },
                      ]
                    : [
                        {
                          text: 'Cancel',
                          onPress: onDismiss,
                        },
                        {
                          text: 'Create contact',
                          disabled: loading || !saveRule,
                          onPress: () => {
                            this.setState({
                              currentContact: formValues,
                              isConfirming: formValues.isTrustedContact,
                              isChangingTaxDepStatus: formValues.isTaxDependent,
                            });

                            !formValues.isTrustedContact &&
                              this.handleSave(addContact);
                          },
                        },
                      ]
                }
              >
                {isConfirming ? (
                  <ContactConfirmView
                    breakpoints={breakpoints}
                    {...this.state.currentContact}
                  />
                ) : (
                  <HandleContactView
                    breakpoints={breakpoints}
                    hasTaxGoal={hasTaxGoal}
                    hasRetirementGoal={hasRetirementGoal}
                    formValues={formValues}
                    hasTrustedContact={hasTrustedContact}
                    initialValues={this.state.currentContact || initialValues}
                  />
                )}
              </EditInfoLayout>
            )}
          </AddContact>
        )}
      </LinkContact>
    );
  }
}

export default AddContactView;
