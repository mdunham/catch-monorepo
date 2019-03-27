import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getFormValues, getFormSyncErrors } from 'redux-form';

import { Box, Flex, H1, H4, Fine, SplitLayout } from '@catch/rio-ui-kit';
import { goTo, navigationPropTypes, createLogger } from '@catch/utils';
import { toastActions } from '@catch/errors';

import { IdentityVerificationForm } from '../forms';
import { UpdateUserProvider } from '../containers';
import { FlowLayout, SmallPageTitle } from '../components';

const Log = createLogger('PlanVerifyIdentityView');

const PREFIX = 'catch.plans.PlanVerifyIdentityView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  success: <FormattedMessage id={`${PREFIX}.success`} />,
  failure: <FormattedMessage id={`${PREFIX}.failure`} />,
};

// see UploadIdentityDocumentation container...
export class PlanVerifyIdentityView extends Component {
  static propTypes = {
    moduleName: PropTypes.string,
    popToast: PropTypes.func.isRequired,
    popErrorToast: PropTypes.func.isRequired,
    uploadIdentification: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    ...navigationPropTypes,
  };

  static defaultProps = {
    moduleName: null,
  };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  handleNext = async () => {
    const { uploadIdentification, moduleName, popToast } = this.props;

    try {
      const upload = await uploadIdentification();

      popToast({
        title: 'Thank you',
        msg: COPY['success'],
      });
      if (moduleName) {
        // if id review is in middle of setting up a vertical
        this.goTo(`/plan/${moduleName}/regulatory`);
      } else {
        // if id is review is one-off
        this.goTo('/plan');
      }
      return upload;
    } catch (e) {
      Log.error(e);
    }
  };

  render() {
    const { onBack, formValues, syncErrors, loading } = this.props;

    const standardValidations =
      syncErrors &&
      !syncErrors.identificationType &&
      !syncErrors.documentNumber &&
      !syncErrors.expirationDate &&
      !syncErrors.issuedDate;

    const extraValidations =
      syncErrors && !syncErrors.issuingState && standardValidations;

    const canClickNext =
      formValues &&
      (formValues.identificationType === 'DRIVERS_LICENSE' ||
        formValues.identificationType === 'STATE_ID')
        ? extraValidations
        : standardValidations;

    return (
      <FlowLayout
        onBack={onBack}
        onNext={this.handleNext}
        canClickNext={canClickNext}
        isLoading={loading}
      >
        <SmallPageTitle subtitle={COPY['subtitle']}>
          {COPY['title']}
        </SmallPageTitle>
        <Box>
          <IdentityVerificationForm initialValues={{}} />
        </Box>
        <Box />
      </FlowLayout>
    );
  }
}

const withRedux = connect(
  state => ({
    formValues: getFormValues('IdentityVerificationForm')(state),
    syncErrors: getFormSyncErrors('IdentityVerificationForm')(state),
  }),
  { ...toastActions },
);

export default withRedux(PlanVerifyIdentityView);
