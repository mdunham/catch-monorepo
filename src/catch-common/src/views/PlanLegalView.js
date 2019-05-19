import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { format } from 'date-fns';
import { compose } from 'redux';
import {
  Box,
  Text,
  Spinner,
  CenterFrame,
  withDimensions,
  styles,
} from '@catch/rio-ui-kit';
import {
  goTo,
  getRouteState,
  getParentRoute,
  navigationPropTypes,
  toGQLDate,
  createLogger,
} from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { SaveLegalForm, UserInfo } from '../containers';
import { LegalAddressForm, SocialOccupationForm, SSNField } from '../forms';
import { FlowLayout, SmallPageTitle } from '../components';
import LegalInfoView from './LegalInfoView';
import CheckSSNView from './CheckSSNView';

const Log = createLogger('PlanLegalView');

const PREFIX = 'catch.plans.PlanLegalView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  flowTitle: <FormattedMessage id={`${PREFIX}.flowTitle`} />,
  flowSubtitle: <FormattedMessage id={`${PREFIX}.flowSubtitle`} />,
  disclosuresCTA: <FormattedMessage id={`${PREFIX}.disclosuresCTA`} />,
};

const CONTEXT_STAGES = {
  name: 'name',
  metadata: 'metadata',
};

// When a user has saved their info but need to review, the form reinitializes with
// server values and only 4 last digits of the SSN so the length validation is conditional
export function canClickNext(formValues, hasSSN) {
  return (
    !!formValues.street1 &&
    !!formValues.city &&
    !!formValues.zip &&
    !!formValues.ssn &&
    (formValues.ssn.length === 11 || hasSSN) &&
    !!formValues.occupation &&
    !!formValues.phoneNumber &&
    !!formValues.givenName &&
    !!formValues.familyName
  );
}

export class PlanLegalView extends Component {
  static propTypes = {
    moduleName: PropTypes.string.isRequired,
    disclosureFormValues: PropTypes.object,
    legalAccountFormValues: PropTypes.object,
    socialFormValues: PropTypes.object,
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);

    this.state = {
      showContextModal: false,
      needed: null,
      resetSSN: false,
      checkSSN: false,
    };

    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
    this.getParentRoute = getParentRoute.bind(this);
  }

  toggleContextModal = () => {
    this.setState({ showContextModal: !this.state.showContextModal });
  };

  handleConfirm = () => {
    const rootPath = this.getParentRoute();

    this.goTo([rootPath, '/regulatory'], { prevPath: [rootPath, '/legal'] });
  };

  handleIneligibleUser = ({ needed }) => {
    const rootPath = this.getParentRoute();

    this.goTo([rootPath, '/ineligible'], { prevPath: [rootPath, '/legal'] });
  };

  handleIDV = () => {
    const rootPath = this.getParentRoute();

    this.goTo([rootPath, '/identity-verification'], {
      prevPath: [rootPath, '/legal'],
    });
  };

  handleKycReview = ({ needed }) => {
    this.setState({ needed });
  };

  /*
   * KYC Status documentation from BBVA
   * https://openplatformbbva.com/docs/reference%7Capiref%7Ccustomers%7C~consumer~v30%7Cpost
   */

  handleNext = async ({ checkKYC }) => {
    const {
      data: {
        kycCheck: { status, needed },
      },
    } = await checkKYC();
    Log.debug({ status, needed });

    // the user needs their legal name, ssn, dob, or address reviewed
    const shouldReviewInfo =
      status === 'KYC_REVIEW' &&
      (needed &&
        (needed.includes('KYC_MISMATCH') ||
          needed.includes('KYC_DOB') ||
          needed.includes('KYC_ADDRESS') ||
          needed.includes('KYC_SSN') ||
          needed.includes('KYC_NAME')));

    if (status === 'KYC_REVIEW' && !needed.includes('KYC_OFAC')) {
      this.handleKycReview({ needed });
    }

    /**
     * Testing notes
     * ssn must be 111-11-1111
     *
     * Add one of the following to the street2 field to test these
     * ['address', 'ssn', 'dob', 'name', 'idv', 'mismatch', 'ofac']
     *
     * You can also do multiple with address|ssn|dob etc
     */

    if (status === 'KYC_DENIED') {
      // if user is denied, send them to ineligible screen
      this.handleIneligibleUser({ needed });
    } else if (!!shouldReviewInfo) {
      this.setState({
        showContextModal: true,
      });
      // reset SSN field if user clicks edit info
      if (needed.includes('KYC_SSN') || needed.includes('KYC_MISMATCH')) {
        this.setState({ resetSSN: true });
      } else {
        this.setState({ resetSSN: false });
      }
    } else if (
      status === 'KYC_REVIEW' &&
      needed &&
      needed.includes('KYC_ID_FIELDS')
    ) {
      // the user needs to upload identification
      this.handleIDV();
    } else {
      // if user is good, KYC_OFAC, or kyc check throws 500, send them to regulatory screen
      this.handleConfirm();
    }
  };

  // i'm not happy about this solution, but you cant send back null in SSN
  handleSave = async ({
    hasSSN,
    updateUser,
    updateLegalAddress,
    updateSSN,
    checkKYC,
    validateSSN,
  }) => {
    const { legalAccountFormValues, socialFormValues } = this.props;

    const userPayload = {
      variables: {
        input: {
          givenName: socialFormValues.givenName,
          familyName: socialFormValues.familyName,
          phoneNumber: socialFormValues.phoneNumber,
          dob: toGQLDate(socialFormValues.dob),
          employment: {
            occupation: socialFormValues.occupation,
          },
          residency: {
            isUSCitizen: true, // hard coding for alpha
            citizenshipCountry: 'USA', // hard coding for alpha
          },
        },
      },
    };

    const addressPayload = {
      variables: {
        input: {
          ...legalAccountFormValues,
          country: 'USA',
        },
      },
    };

    const ssnPayload = {
      variables: {
        input: { ssn: socialFormValues.ssn },
      },
    };

    try {
      // update user no matter what
      await updateUser(userPayload);
      await updateLegalAddress(addressPayload);

      let isValidSSN;

      // trigger function to validate ssn, meant to detect if a user is trying open more account with the same SSN
      if (!hasSSN) {
        const { data } = await validateSSN(ssnPayload);

        isValidSSN = data.validateSSN;
      }

      // update SSN here if there's no SSN on user object or user is asked to reset SSN
      if (isValidSSN) {
        await updateSSN(ssnPayload);

        this.handleNext({ checkKYC });
      } else {
        this.setState({ resetSSN: true, checkSSN: true });
        Log.error('SSN is duplicate');
      }
    } catch (e) {
      Log.error(e);
    }
  };

  render() {
    const {
      canFinish,
      legalAccountFormValues,
      socialFormValues,
      planTitle,
      onBack,
      onNext,
      paycheckPercentage,
      next,
      viewport,
      breakpoints,
      ...rest
    } = this.props;
    const isMobile = viewport === 'PhoneOnly';
    const isNative = Platform.OS !== 'web';

    // Merge all the form values, if they are not available the object will be empty
    const mergedValues = Object.assign(
      {},
      legalAccountFormValues,
      socialFormValues,
    );

    return (
      <ErrorBoundary component={ErrorMessage}>
        <UserInfo>
          {({
            loading,
            legalAddress,
            phoneNumber,
            ssn,
            occupation,
            hasSSN,
            dob,
            givenName,
            familyName,
            kycNeeded,
          }) =>
            loading ? (
              <CenterFrame>
                <Spinner large />
              </CenterFrame>
            ) : (
              <SaveLegalForm refetch>
                {({
                  updateUser,
                  updateSSN,
                  updateLegalAddress,
                  checkKYC,
                  updating,
                  validateSSN,
                  validatingSSN,
                }) => (
                  <FlowLayout
                    onBack={onBack}
                    onNext={() =>
                      this.handleSave({
                        hasSSN,
                        updateUser,
                        updateSSN,
                        updateLegalAddress,
                        checkKYC,
                        validateSSN,
                      })
                    }
                    canClickNext={canClickNext(mergedValues, hasSSN)}
                    isLoading={updating || validatingSSN}
                  >
                    <View
                      style={styles.get(
                        [
                          'FormMax',
                          'TopSpace',
                          'BottomSpace',
                          breakpoints.select({ PhoneOnly: 'SmMargins' }),
                        ],
                        viewport,
                      )}
                    >
                      <Text size="large" weight="bold" mb={1}>
                        {COPY['title']}
                      </Text>
                      <Text mb={4}>{COPY['subtitle']}</Text>
                      <SocialOccupationForm
                        initialValues={{
                          givenName,
                          familyName,
                          occupation,
                          ssn: this.state.resetSSN ? null : ssn,
                          phoneNumber,
                          dob: format(dob, 'MM/DD/YYYY'),
                        }}
                        isMobile={isMobile}
                        viewport={viewport}
                        resetSSN={this.state.resetSSN}
                        needed={kycNeeded}
                        white={!isNative}
                      />
                      <LegalAddressForm
                        initialValues={{ ...legalAddress }}
                        needed={kycNeeded}
                        isMobile={isMobile}
                        grouped
                        white={!isNative}
                      />
                      <SSNField
                        form="SocialOccupationForm"
                        socialSaved={!!ssn}
                        ssn={this.state.resetSSN ? null : ssn}
                        alert={
                          kycNeeded &&
                          kycNeeded.includes('KYC_SSN') &&
                          ssn === socialFormValues.ssn
                        }
                      />
                    </View>

                    {this.state.showContextModal && (
                      <LegalInfoView
                        onConfirm={this.handleIDV}
                        onRequestClose={this.toggleContextModal}
                        needed={this.state.needed}
                      />
                    )}

                    {this.state.checkSSN && (
                      <CheckSSNView
                        closeModal={() =>
                          this.setState({ checkSSN: false, resetSSN: true })
                        }
                      />
                    )}
                  </FlowLayout>
                )}
              </SaveLegalForm>
            )
          }
        </UserInfo>
      </ErrorBoundary>
    );
  }
}

const withFormValues = connect(state => ({
  legalAccountFormValues: getFormValues('LegalAccountForm')(state),
  socialFormValues: getFormValues('SocialOccupationForm')(state),
}));

const enhance = compose(
  withDimensions,
  withFormValues,
);

export default enhance(PlanLegalView);
