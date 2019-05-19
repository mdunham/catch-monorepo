import React from 'react';
import PropTypes from 'prop-types';
import { Linking, View, Text, TouchableOpacity } from 'react-native';
import { isPristine, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import access from 'safe-access';

import { AdjustTaxesView, EditInfoLayout, selectIncome } from '@catch/common';
import { Icon, styles, colors } from '@catch/rio-ui-kit';
import { toastActions } from '@catch/errors';
import { calculateTaxes, precisionRound } from '@catch/utils';

import { TaxDependents, UnlinkMultipleContacts } from '../containers';
import {
  UnaccountedTaxDependentsForm,
  UpdateTaxDependentsForm,
} from '../forms';

import AddTaxDependentView from './AddTaxDependentView';

const PREFIX = 'catch.module.taxes.UpdateTaxDependentsView';
export const COPY = {
  cancel: <FormattedMessage id={`${PREFIX}.cancel`} />,
  save: <FormattedMessage id={`${PREFIX}.save`} />,
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: values => (
    <FormattedMessage id={`${PREFIX}.description`} values={values} />
  ),
  link: <FormattedMessage id={`${PREFIX}.link`} />,
};

const buildUnaccountedInitialValues = number => {
  let obj = {};

  [...Array(number)].forEach((_, idx) => (obj[`unaccounted_${idx}`] = true));

  return obj;
};

export class UpdateTaxDependentsView extends React.Component {
  static propTypes = {
    breakpoints: PropTypes.object.isRequired,
    formValues: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    upsertTaxGoal: PropTypes.func.isRequired,
    unaccountedFormValues: PropTypes.object,
    isPristine: PropTypes.bool,
    isUnaccountedFormPristine: PropTypes.bool,
    popToast: PropTypes.func,
    workType: PropTypes.string,
    estimatedW2Income: PropTypes.number,
    estimated1099Income: PropTypes.number,
    spouseIncome: PropTypes.number,
    paycheckPercentage: PropTypes.number,
  };

  state = {
    numDependentsToRemove: [],
    dependentIDsToRemove: [],
    toasts: [],
    adjustingTaxPercentage: false,
    addingContact: false,
  };

  /**
   * handler for navigating to a help article about tax dependents
   */
  handleInfo = () => {
    return Linking.openURL(
      'https://help.catch.co/setting-up-tax-withholding/who-qualifies-as-a-dependent',
    );
  };

  /**
   * Handler for determining:
   * 1. by how much should the numDependents value on taxGoal change based on accounted tax dependents
   * 2. which contact's ids needed to be unlinked
   */
  handleAccountedNumDependentsChange = () => {
    const { formValues } = this.props;

    Object.keys(formValues).forEach(key => {
      !formValues[key] && this.state.numDependentsToRemove.push(key);
    });

    Object.keys(formValues).forEach(key => {
      !formValues[key] && this.state.dependentIDsToRemove.push(key);
    });
  };

  /**
   * Handler for determing how the numDependents value should change based on changes to unaccounted tax dependents
   */
  handleUnaccountedNumDependentsChange = () => {
    const { unaccountedFormValues } = this.props;

    Object.keys(unaccountedFormValues).forEach(
      key =>
        !unaccountedFormValues[key] &&
        this.state.numDependentsToRemove.push(key),
    );
  };

  /**
   * Handler for saving the results
   *
   * 1. unlink the contacts that have needed to be removed
   * 2. update the tax goal with the new numDepoendents value
   */
  handleSave = (unlinkContacts, numDependents) => {
    const { isPristine, isUnaccountedFormPristine, upsertTaxGoal } = this.props;
    const { toasts } = this.state;

    if (!isPristine) {
      this.handleAccountedNumDependentsChange();
    }

    if (!isUnaccountedFormPristine) {
      this.handleUnaccountedNumDependentsChange(numDependents);
    }

    const newDependentsNumber =
      this.state.numDependentsToRemove &&
      numDependents - this.state.numDependentsToRemove.length;

    if (this.state.dependentIDsToRemove.length > 0) {
      unlinkContacts({
        variables: {
          ids: this.state.dependentIDsToRemove,
          type: 'TAX_DEPENDENT',
        },
      });
    }

    if (this.state.numDependentsToRemove.length > 0) {
      upsertTaxGoal({
        variables: {
          input: {
            numDependents: newDependentsNumber,
          },
        },
      });

      toasts.push({
        type: 'success',
        title: 'Tax withholding details updated',
        msg: `You now have ${newDependentsNumber} tax ${
          newDependentsNumber === 1 ? 'dependent' : 'dependents'
        } on file.`,
      });

      this.setState({ toasts: toasts });
    }

    this.handleTaxPercentage(newDependentsNumber);
  };

  handleTaxPercentage = numDependents => {
    const {
      workType,
      estimated1099Income,
      estimatedW2Income,
      incomeState,
      spouseIncome,
      filingStatus,
      paycheckPercentage,
    } = this.props;

    const grossIncome = selectIncome(
      { estimatedW2Income, estimated1099Income },
      workType,
    );

    const CALCULATIONS = calculateTaxes({
      state: incomeState,
      filingStatus: filingStatus,
      grossIncome: grossIncome,
      spouseIncome: spouseIncome,
      numExemptions: 0,
      numDependents: numDependents,
    });

    const reccPercentage = access(CALCULATIONS, 'roundedPaycheckPercentage');

    if (paycheckPercentage === reccPercentage) {
      this.popToasts();
    } else {
      this.setState({ adjustingTaxPercentage: true, addingContact: false });
    }
  };

  pushToast = toast => {
    const { toasts } = this.state;

    toasts.push(toast);

    this.setState({ toasts: toasts });
  };

  popToasts = () => {
    const { toasts } = this.state;
    const { onCancel, popToast } = this.props;

    toasts && toasts.forEach(tst => popToast(tst));
    onCancel();
  };

  render() {
    const {
      breakpoints,
      onCancel,
      isPristine,
      isUnaccountedFormPristine,
      upsertTaxGoal,
    } = this.props;

    return (
      <TaxDependents>
        {({
          taxDependents,
          initialValues,
          unaccountedTaxDependents,
          numDependents,
        }) => {
          return this.state.adjustingTaxPercentage ? (
            <AdjustTaxesView
              onCompleted={data => {
                // push a new toasts indicating the new tax percentage
                this.pushToast({
                  type: 'success',
                  title: 'Contribution updated for Tax Withholding',
                  msg: `Settings aside ${precisionRound(
                    data.rate * 100,
                    2,
                  )}% of each paycheck.`,
                });

                this.popToasts();
              }}
              onCancel={this.popToasts}
              breakpoints={breakpoints}
              dependents
            />
          ) : this.state.addingContact ? (
            <AddTaxDependentView
              breakpoints={breakpoints}
              onCancel={onCancel}
              onCompleted={({ linkContact: { givenName, familyName } }) => {
                this.pushToast({
                  type: 'success',
                  title: `${givenName} ${familyName} is connected to your plan`,
                  msg: `${givenName} is listed as your dependent for Tax Withholding.`,
                });

                // after adding a taxdependent, we need to increase the number of tax dependents on the taxGoal
                upsertTaxGoal({
                  variables: { input: { numDependents: numDependents + 1 } },
                });
                // with the new number of tax dependents, the user's recc percentage may have changed
                this.handleTaxPercentage(numDependents + 1);
              }}
            />
          ) : (
            <UnlinkMultipleContacts>
              {({ unlinkContacts }) => (
                <EditInfoLayout
                  breakpoints={breakpoints}
                  actions={[
                    { text: COPY['cancel'], onPress: onCancel },
                    {
                      text: COPY['save'],
                      disabled: isUnaccountedFormPristine && isPristine,
                      onPress: () =>
                        this.handleSave(unlinkContacts, numDependents),
                    },
                  ]}
                >
                  <Text
                    style={styles.get(
                      ['H4', 'BottomGutter'],
                      breakpoints.current,
                    )}
                  >
                    {COPY['title']}
                  </Text>

                  <Text style={styles.get('Body', breakpoints.current)}>
                    {COPY['description']({
                      link: (
                        <Text
                          onPress={this.handleInfo}
                          style={styles.get('BodyLink', breakpoints.current)}
                        >
                          {COPY['link']}
                        </Text>
                      ),
                    })}
                  </Text>

                  <View style={styles.get('TopGutter')}>
                    <View style={styles.get('Bilateral')}>
                      <Text
                        style={styles.get(
                          ['Body', 'Medium'],
                          breakpoints.current,
                        )}
                      >
                        Tax dependents
                      </Text>
                      <TouchableOpacity style={styles.get('CenterRightRow')}>
                        <Icon fill={colors.flare} name="naked-plus" size={11} />
                        <Text
                          style={styles.get(
                            ['BodyLink', 'XsLeftGutter'],
                            breakpoints.current,
                          )}
                          onPress={() => this.setState({ addingContact: true })}
                        >
                          New
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <UpdateTaxDependentsForm
                      breakpoints={breakpoints}
                      initialValues={initialValues}
                      taxDependents={taxDependents}
                      unaccountedTaxDependents={unaccountedTaxDependents}
                    />
                    {unaccountedTaxDependents > 0 && (
                      <UnaccountedTaxDependentsForm
                        unaccountedTaxDependents={unaccountedTaxDependents}
                        breakpoints={breakpoints}
                        initialValues={buildUnaccountedInitialValues(
                          unaccountedTaxDependents,
                        )}
                        numDependents={numDependents}
                      />
                    )}
                  </View>
                </EditInfoLayout>
              )}
            </UnlinkMultipleContacts>
          );
        }}
      </TaxDependents>
    );
  }
}

const withRedux = connect(
  state => ({
    isPristine: isPristine('UpdateTaxDependentsForm')(state),
    formValues: getFormValues('UpdateTaxDependentsForm')(state),
    unaccountedFormValues: getFormValues('UnaccountedTaxDependentsForm')(state),
    isUnaccountedFormPristine: isPristine('UnaccountedTaxDependentsForm')(
      state,
    ),
  }),
  {
    popToast: toastActions.popToast,
  },
);

const Component = withRedux(UpdateTaxDependentsView);
Component.displayName = 'UpdateTaxDependentsView';

export default Component;
