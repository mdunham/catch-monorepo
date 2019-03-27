import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { createLogger } from '@catch/utils';

import { EditInfoLayout } from '../components';
import { LinkContact, UnlinkContact, UpdateContact } from '../containers';

import ContactContextChangesView from './ContactContextChangesView';
import HandleContactView from './HandleContactView';

const Log = createLogger('edit-contact-view');

export class EditContactView extends React.Component {
  static propTypes = {
    breakpoints: PropTypes.object.isRequired,
    connectedDependents: PropTypes.number,
    calcTaxes: PropTypes.func,
    formValues: PropTypes.object,
    hasTaxGoal: PropTypes.bool,
    hasRetirementGoal: PropTypes.bool,
    hasTrustedContact: PropTypes.bool,
    numDependents: PropTypes.number,
    onDismiss: PropTypes.func.isRequired,
    pushToast: PropTypes.func.isRequired,
    toggleDelete: PropTypes.func.isRequired,
    upsertTaxGoal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isChangingTaxDepNumber: false,
      isChangingTaxDepStatus: false,
      isChangingTrustedContactStatus: false,
      proposedValues: null,
      taxDepStatusDirection: null,
    };
  }

  /**
   * handler for figuring out the numDependents the tax goal should change to
   */

  determineNumDependentsChange = () => {
    const {
      connectedDependents,
      formValues,
      numDependents,
      thisContact,
    } = this.props;
    const { isChangingTaxDepNumber, proposedValues } = this.state;

    Log.debug({ isChangingTaxDepNumber });

    // solves issue where tax dep change could get out of whack
    // basically, the numDependents on tax goal and number of contacts designated can get out of sync
    // so set the base value for future calculations accordingly
    let proposedDependents = null;

    const cc = formValues || proposedValues;

    if (cc.isTaxDependent !== thisContact.isTaxDependent) {
      if (cc.isTaxDependent) {
        proposedDependents =
          connectedDependents === numDependents && numDependents + 1;
      } else {
        proposedDependents = numDependents - 1;
      }
    }

    return proposedDependents;
  };

  handleUpdate = updateContact => {
    const { formValues, pushToast, thisContact } = this.props;
    const { proposedValues } = this.state;

    const cc = formValues || proposedValues;

    pushToast({
      type: 'success',
      title: `${cc.givenName} ${cc.familyName} has been updated`,
    });

    updateContact({
      variables: {
        id: thisContact.id,
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

  handleTaxGoalUpdate = num => {
    const { upsertTaxGoal } = this.props;

    upsertTaxGoal({
      variables: {
        input: {
          numDependents: num,
        },
      },
    });
  };

  handleLinking = (linkContact, unlinkContact) => {
    const {
      calcTaxes,
      formValues,
      thisContact,
      onDismiss,
      toggleTaxAdjustment,
      pushToast,
    } = this.props;
    const {
      isChangingTaxDepNumber,
      isChangingTaxDepStatus,
      proposedValues,
      taxDepStatusDirection,
    } = this.state;

    const cc = formValues || proposedValues;

    if (thisContact.isTrustedContact !== cc.isTrustedContact) {
      if (cc.isTrustedContact) {
        linkContact({
          variables: {
            id: thisContact.id,
            type: 'RETIREMENT_TRUSTED_CONTACT',
          },
        });

        pushToast({
          type: 'success',
          title: `Connection added for ${cc.givenName} ${cc.familyName}`,
          msg: `${
            cc.givenName
          } is now listed as your trusted contact for Retirement.`,
        });
      } else {
        unlinkContact({
          variables: {
            id: thisContact.id,
            type: 'RETIREMENT_TRUSTED_CONTACT',
          },
        });

        pushToast({
          type: 'success',
          title: `Connection removed for ${cc.givenName} ${cc.familyName}`,
          msg: `${
            cc.givenName
          } is no longer listed as your trusted contact for Retirement.`,
        });
      }
    }

    const proposedDependents =
      isChangingTaxDepNumber && this.determineNumDependentsChange();

    if (isChangingTaxDepStatus) {
      if (taxDepStatusDirection === 'ADD') {
        linkContact({
          variables: { id: thisContact.id, type: 'TAX_DEPENDENT' },
        });

        pushToast({
          type: 'success',
          title: `Connection added for ${cc.givenName} ${cc.familyName}`,
          msg: `${
            cc.givenName
          } is now listed as your dependent for Tax Withholding.`,
        });
      }

      if (taxDepStatusDirection === 'REMOVE') {
        unlinkContact({
          variables: { id: thisContact.id, type: 'TAX_DEPENDENT' },
        });

        pushToast({
          type: 'success',
          title: `Connection removed for ${cc.givenName} ${cc.familyName}`,
          msg: `${
            cc.givenName
          } is no longer listed as your dependent for Tax Withholding.`,
        });
      }

      isChangingTaxDepNumber &&
        this.handleTaxGoalUpdate(this.determineNumDependentsChange());

      const txv = isChangingTaxDepNumber && calcTaxes(proposedDependents);

      if (txv) {
        return txv.hasChanged ? toggleTaxAdjustment() : onDismiss();
      }
      onDismiss();
    } else {
      onDismiss();
    }
  };

  render() {
    const {
      breakpoints,
      connectedDependents,
      hasTaxGoal,
      hasRetirementGoal,
      hasTrustedContact,
      formValues,
      numDependents,
      onDismiss,
      saveRule,
      thisContact,
      toggleDelete,
    } = this.props;

    const {
      isChangingTaxDepNumber,
      isChangingTaxDepStatus,
      isChangingTrustedContactStatus,
      proposedValues,
    } = this.state;

    const isUpdatingStatusProps =
      isChangingTaxDepNumber || isChangingTrustedContactStatus;

    return (
      <LinkContact isChangingTaxDepStatus={isChangingTaxDepStatus}>
        {({ linkContact }) => (
          <UnlinkContact>
            {({ unlinkContact }) => (
              <UpdateContact
                onCompleted={() =>
                  this.handleLinking(linkContact, unlinkContact)
                }
                contactId={thisContact.id}
              >
                {({ updateContact, loading }) => (
                  <EditInfoLayout
                    breakpoints={breakpoints}
                    onClose={onDismiss}
                    title={
                      isUpdatingStatusProps ? 'Confirm changes' : 'Edit contact'
                    }
                    actions={
                      isUpdatingStatusProps
                        ? [
                            {
                              text: 'Edit',
                              onPress: () =>
                                this.setState({
                                  isChangingTaxDepStatus: false,
                                  isChangingTrustedContactStatus: false,
                                  isChangingTaxDepNumber: false,
                                }),
                            },
                            {
                              text: 'Update contact',
                              onPress: () => this.handleUpdate(updateContact),
                            },
                          ]
                        : [
                            {
                              text: 'Cancel',
                              onPress: onDismiss,
                            },
                            {
                              text: 'Update contact',
                              disabled: loading || !saveRule,
                              onPress: () => {
                                this.setState({
                                  proposedValues: formValues,
                                  isChangingTaxDepNumber: this.determineNumDependentsChange()
                                    ? this.determineNumDependentsChange() !==
                                      numDependents
                                    : thisContact.isTaxDependent !==
                                        formValues.isTaxDependent &&
                                      connectedDependents === numDependents,
                                  isChangingTaxDepStatus:
                                    thisContact.isTaxDependent !==
                                    formValues.isTaxDependent,
                                  taxDepStatusDirection:
                                    thisContact.isTaxDependent !==
                                    formValues.isTaxDependent
                                      ? formValues.isTaxDependent
                                        ? 'ADD'
                                        : 'REMOVE'
                                      : null,
                                  isChangingTrustedContactStatus:
                                    thisContact.isTrustedContact !==
                                    formValues.isTrustedContact,
                                });

                                const needsConfirmation =
                                  thisContact.isTaxDependent !==
                                  formValues.isTaxDependent
                                    ? this.determineNumDependentsChange() !==
                                      numDependents
                                    : thisContact.isTrustedContact !==
                                      formValues.isTrustedContact;

                                !needsConfirmation &&
                                  this.handleUpdate(updateContact);
                              },
                            },
                          ]
                    }
                  >
                    {isUpdatingStatusProps ? (
                      <ContactContextChangesView
                        breakpoints={breakpoints}
                        isChangingTaxDependentsNumber={isChangingTaxDepNumber}
                        isChangingTrustedContact={
                          isChangingTrustedContactStatus
                        }
                        isAddingTrustedContact={proposedValues.isTrustedContact}
                        currentValue={numDependents}
                        proposedValue={this.determineNumDependentsChange()}
                        fullName={`${proposedValues.givenName} ${
                          proposedValues.familyName
                        }`}
                      />
                    ) : (
                      <HandleContactView
                        onDelete={toggleDelete}
                        hasTaxGoal={hasTaxGoal}
                        hasRetirementGoal={hasRetirementGoal}
                        hasTrustedContact={hasTrustedContact}
                        isTrustedContact={thisContact.isTrustedContact}
                        breakpoints={breakpoints}
                        formValues={formValues}
                        initialValues={thisContact}
                      />
                    )}
                  </EditInfoLayout>
                )}
              </UpdateContact>
            )}
          </UnlinkContact>
        )}
      </LinkContact>
    );
  }
}

export default EditContactView;
