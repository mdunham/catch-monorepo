import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { createLogger } from '@catch/utils';

import { EditInfoLayout } from '../components';
import { DeleteContact } from '../containers';
import ContactContextChangesView from './ContactContextChangesView';

const Log = createLogger('delete-contact-view');

export class DeleteContactView extends React.Component {
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

  state = { thisContact: null };

  handleOnCompleted = () => {
    const {
      calcTaxes,
      numDependents,
      toggleTaxAdjustment,
      onDismiss,
      pushToast,
      upsertTaxGoal,
      thisContact,
    } = this.props;

    const cc = thisContact || this.state.thisContact;

    pushToast({
      title: `${cc.givenName} ${cc.familyName} has been deleted from your plan`,
      type: 'success',
    });

    this.state.isTaxDependent &&
      upsertTaxGoal({
        variables: { input: { numDependents: numDependents - 1 } },
      });

    const txv = calcTaxes(numDependents - 1);

    if (txv && txv.hasChanged) {
      toggleTaxAdjustment();
    } else {
      onDismiss();
    }
  };

  render() {
    const { breakpoints, onDismiss, numDependents, thisContact } = this.props;

    const cc = thisContact || this.state.thisContact;

    return (
      <DeleteContact
        isTaxDependent={cc.isTaxDependent}
        onCompleted={this.handleOnCompleted}
      >
        {({ deleteContact, loading }) => (
          <EditInfoLayout
            breakpoints={breakpoints}
            onClose={onDismiss}
            actions={[
              {
                text: 'Keep contact',
                onPress: onDismiss,
              },
              {
                text: 'Delete contact',
                disabled: loading,
                danger: true,
                onPress: () => {
                  this.setState({
                    isTaxDependent: thisContact.isTaxDependent,
                    thisContact: thisContact,
                  });

                  deleteContact({
                    variables: {
                      id: thisContact.id,
                    },
                  });
                },
              },
            ]}
          >
            <ContactContextChangesView
              isDeleting
              breakpoints={breakpoints}
              isChangingTaxDependentsNumber={cc.isTaxDependent}
              isChangingTrustedContact={cc.isTrustedContact}
              currentValue={numDependents}
              proposedValue={numDependents - 1}
              fullName={`${cc.givenName} ${cc.familyName}`}
            />
          </EditInfoLayout>
        )}
      </DeleteContact>
    );
  }
}

export default DeleteContactView;
