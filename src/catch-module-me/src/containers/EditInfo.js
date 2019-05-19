import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View } from 'react-native';
import { connect } from 'react-redux';
import {
  submit,
  destroy,
  formValueSelector,
  isPristine,
  getFormSyncErrors,
  isSubmitting,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import {
  Modal,
  Box,
  Button,
  Text,
  H3,
  colors,
  styles,
  withDimensions,
  Icon,
  Spinner,
} from '@catch/rio-ui-kit';
import * as User from '@catch/common';
import { toGQLDate, createLogger, Percentage, Currency } from '@catch/utils';
import { toastActions } from '@catch/errors';
import UserInfoTriggers from './UserInfoTriggers';

import * as Views from '../views';

const { UpdateUserMetaData, UpdateUser, EditInfoLayout } = User;

const Log = createLogger('edit-info:');

const PREFIX = 'catch.module.me.EditInfo';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  caption: <FormattedMessage id={`${PREFIX}.caption`} />,
  saveButton: <FormattedMessage id={`${PREFIX}.saveButton`} />,
  nextButton: <FormattedMessage id={`${PREFIX}.nextButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
  successToastTitle: values => (
    <FormattedMessage
      id={`catch.module.me.UserDetailsView.successToastTitle`}
      values={values}
    />
  ),
  successToastMsg: values => (
    <FormattedMessage
      id={`catch.module.me.UserDetailsView.successToastMsg`}
      values={values}
    />
  ),
  'defaultToast.title': values => (
    <FormattedMessage id={`${PREFIX}.defaultToast.title`} values={values} />
  ),
  'defaultToast.msg': values => (
    <FormattedMessage id={`${PREFIX}.defaultToast.msg`} values={values} />
  ),
  'TrustedContactForm.title': (
    <FormattedMessage id={`${PREFIX}.TrustedContactForm.title`} />
  ),
  'TrustedContactForm.caption': (
    <FormattedMessage id={`${PREFIX}.TrustedContactForm.caption`} />
  ),
  'UserIncomeField.title': (
    <FormattedMessage id={`${PREFIX}.UserIncomeField.title`} />
  ),
  'UserIncomeField.caption': (
    <FormattedMessage id={`${PREFIX}.UserIncomeField.caption`} />
  ),
  'WorkTypeField.title': (
    <FormattedMessage id={`${PREFIX}.WorkTypeField.title`} />
  ),
  'WorkTypeField.caption': (
    <FormattedMessage id={`${PREFIX}.WorkTypeField.caption`} />
  ),
  'WorkTypeAndIncomeToast.title': (
    <FormattedMessage id={`${PREFIX}.WorkTypeAndIncomeToast.title`} />
  ),
  'WorkTypeAndIncomeToast.1099msg': values => (
    <FormattedMessage
      id={`${PREFIX}.WorkTypeAndIncomeToast.1099msg`}
      values={values}
    />
  ),
  'WorkTypeAndIncomeToast.W2msg': values => (
    <FormattedMessage
      id={`${PREFIX}.WorkTypeAndIncomeToast.W2msg`}
      values={values}
    />
  ),
  'WorkTypeAndIncomeToast.MIXEDmsg': values => (
    <FormattedMessage
      id={`${PREFIX}.WorkTypeAndIncomeToast.MIXEDmsg`}
      values={values}
    />
  ),
  'AdjustTaxesToast.title': (
    <FormattedMessage id={`${PREFIX}.AdjustTaxesToast.title`} />
  ),
  'AdjustTaxesToast.msg': values => (
    <FormattedMessage id={`${PREFIX}.AdjustTaxesToast.msg`} values={values} />
  ),
};

const META_FIELDS = [
  'WorkStateField',
  'FilingStatusField',
  'SpouseIncomeField',
  'OccupationField',
  'UserIncomeField',
];

const CUSTOM_HEADERS = {
  TrustedContactForm: {
    title: COPY['TrustedContactForm.title'],
    caption: COPY['TrustedContactForm.caption'],
  },
  UserIncomeField: {
    title: COPY['UserIncomeField.title'],
    caption: COPY['UserIncomeField.caption'],
  },
  WorkTypeField: {
    title: COPY['WorkTypeField.title'],
    caption: COPY['WorkTypeField.caption'],
  },
};

const WorkTypeAndIncomeToast = {
  title: COPY['WorkTypeAndIncomeToast.title'],
  msg: {
    WORK_TYPE_1099: COPY['WorkTypeAndIncomeToast.1099msg'],
    WORK_TYPE_W2: COPY['WorkTypeAndIncomeToast.W2msg'],
    WORK_TYPE_DIVERSIFIED: COPY['WorkTypeAndIncomeToast.MIXEDmsg'],
  },
};

function isMixedIncome(workType, fieldName) {
  return (
    workType === 'WORK_TYPE_DIVERSIFIED' && fieldName === 'UserIncomeField'
  );
}

function isW2Info(workType) {
  return workType === 'WORK_TYPE_DIVERSIFIED' || workType === 'WORK_TYPE_W2';
}

export const EditInfo = ({
  fieldName,
  nextFieldName,
  metaData,
  userData,
  onClose,
  onCompleted,
  submit,
  destroy,
  filingStatus,
  popToast,
  isPristine,
  syncErrors,
  viewport,
  breakpoints,
  estimatedW2Income,
  estimated1099Income,
  triggerContext,
  workType,
  isMutating,
  onInfo,
  goTo,
}) => {
  const Field = User[fieldName];
  const InfoView = Views[fieldName];

  const isNative = Platform.OS !== 'web';
  const isMeta = META_FIELDS.includes(fieldName);

  const initialValues = Object.assign({}, userData, metaData);
  // Allows for going back to a previous screen and keeping the form state
  const destroyOnUnmount =
    fieldName !== 'WorkTypeField' && fieldName !== 'UserIncomeField';
  const renderButtons = fieldName === 'WorkTypeField' ? !isPristine : true;

  const handleToast = context => {
    if (onCompleted) onCompleted();
    Log.debug(context);
    if (context) {
      // Unfortunately those toasts are all different thus I have
      // not been able to find a unified way to handle it properly
      if (Array.isArray(context.updatedFields)) {
        context.updatedFields.forEach(field => {
          const values = field.values;
          if (field.name === 'WorkType&UserIncome') {
            popToast({
              type: 'success',
              title: WorkTypeAndIncomeToast.title,
              msg: WorkTypeAndIncomeToast.msg[values.workType]({
                income: <Currency>{values.estimatedIncome}</Currency>,
              }),
            });
          } else if (field.name === 'AdjustTaxesView') {
            popToast({
              type: 'success',
              title: COPY['AdjustTaxesToast.title'],
              msg: COPY['AdjustTaxesToast.msg']({
                rate: <Percentage>{values.rate}</Percentage>,
              }),
            });
          } else if (field.name === 'UserIncomeField') {
            popToast({
              type: 'success',
              title: COPY['defaultToast.title']({
                fieldName: <User.LabelText fieldName={field.name} />,
              }),
              msg: COPY['defaultToast.msg']({
                fieldName: <User.LabelText fieldName={field.name} lowercase />,
                fieldValue: <Currency>{values.estimatedIncome}</Currency>,
              }),
            });
          }
        });
        destroy('UserInfo');
        return;
      }
    }
    if (Field) {
      const fName =
        fieldName === 'LegalFirstNameField' ? 'LegalNameField' : fieldName;
      popToast({
        type: 'success',
        title: COPY['successToastTitle']({
          fieldName: <User.LabelText fieldName={fName} />,
        }),
        msg: COPY['successToastMsg']({
          fieldName: <User.LabelText fieldName={fName} lowercase />,
        }),
      });
      destroy('UserInfo');
    }
  };

  const handleSubmit = () => {
    /**
     * If we pass a nextFieldName, the flow will navigate to that field
     * and delay submitting until the last field has been validated
     * this is used for updating the workType and estimatedIncome together
     * nextFieldName is passed in @UserDetailsView
     */
    if (nextFieldName) {
      onClose({
        fieldName: nextFieldName,
        // Here we keep track of fields in order to pop relevant toasts at the end
        triggerContext: {
          updatedFields: [{ name: fieldName }],
        },
      });
      return;
    }
    submit('UserInfo');
  };
  // Make sure we destroy the form state every time as sometime we keep it
  // betweem WorkType and UserIncome
  const handleClose = () => {
    onClose();
    destroy('UserInfo');
  };

  const trustedContactSaveRules = !syncErrors.tcName && !syncErrors.tcEmail;
  const display2Fields = isMixedIncome(
    workType || userData.workType,
    fieldName,
  );

  return Field ? (
    <EditInfoLayout
      breakpoints={breakpoints}
      onClose={handleClose}
      actions={
        renderButtons
          ? [
              { text: COPY['cancelButton'], onPress: handleClose },
              {
                text: nextFieldName ? COPY['nextButton'] : COPY['saveButton'],
                onPress: handleSubmit,
                disabled:
                  fieldName === 'TrustedContactForm'
                    ? !trustedContactSaveRules
                    : isMutating
                      ? isMutating
                      : isPristine,
              },
            ]
          : undefined
      }
    >
      <H3 mb={2}>
        {CUSTOM_HEADERS[fieldName]
          ? CUSTOM_HEADERS[fieldName].title
          : COPY['title']}
      </H3>
      <Text mb={3}>
        {CUSTOM_HEADERS[fieldName]
          ? CUSTOM_HEADERS[fieldName].caption
          : COPY['caption']}
      </Text>
      {isMeta ? (
        <UserInfoTriggers
          fieldName={fieldName}
          onClose={onClose}
          onCompleted={handleToast}
          estimatedW2Income={Number(estimatedW2Income)}
          estimated1099Income={Number(estimated1099Income)}
          workType={workType || userData.workType}
          triggerContext={triggerContext}
        >
          <UpdateUserMetaData>
            {({ updateUserMetadata, loading: mutating }) => (
              <React.Fragment>
                <Field
                  initialValues={initialValues}
                  destroyOnUnmount={destroyOnUnmount}
                  form="UserInfo"
                  name={User.setIncomeFieldName(
                    workType || userData.workType,
                    fieldName,
                  )}
                  labelType={display2Fields ? 'W2' : undefined}
                  onSubmit={values =>
                    updateUserMetadata({
                      variables: {
                        userIncome: {
                          estimated1099Income: values.estimated1099Income,
                          estimatedW2Income: values.estimatedW2Income,
                        },
                        spouseIncome: {
                          estimatedIncome: values.spouseIncome,
                        },
                        stateInput: { state: values.workState },
                        filingStatus: values.filingStatus,
                        userMetadata: {
                          workType: values.workType,
                          employment: { occupation: values.occupation },
                        },
                      },
                    })
                  }
                  // For UserIncomeField only
                  onInfoClick={() =>
                    onInfo(
                      isW2Info(workType || userData.workType) ? 'W2' : '1099',
                    )
                  }
                />

                {display2Fields && (
                  <User.UserIncomeField
                    destroyOnUnmount={destroyOnUnmount}
                    name="estimated1099Income"
                    form="UserInfo"
                    labelType="1099"
                    // For UserIncomeField only
                    onInfoClick={() => onInfo('1099')}
                  />
                )}
                {/* @NOTE: if a user changes their filingStatus to MARRIED
            * we pop in the SpouseIncomeField so they don't forget
            */
                filingStatus === 'MARRIED' &&
                  filingStatus !== metaData.filingStatus &&
                  fieldName === 'FilingStatusField' && (
                    <User.SpouseIncomeField form="UserInfo" />
                  )}
              </React.Fragment>
            )}
          </UpdateUserMetaData>
        </UserInfoTriggers>
      ) : (
        <UpdateUser refetch onCompleted={handleToast}>
          {({ updateUser, loading }) => (
            <React.Fragment>
              <Field
                form="UserInfo"
                destroyOnUnmount={destroyOnUnmount}
                initialValues={initialValues}
                onSubmit={values =>
                  updateUser({
                    variables: {
                      input: {
                        workType: values.workType,
                        legalAddress: {
                          street1: values.street1,
                          street2: values.street2,
                          city: values.city,
                          state: values.state,
                          zip: values.zip,
                          country: values.country,
                        },
                        givenName: values.givenName,
                        familyName: values.familyName,
                        phoneNumber: values.phoneNumber,
                        dob: toGQLDate(values.dob),
                        trustedContact: {
                          name: values.tcName,
                          email: values.tcEmail,
                          phoneNumber: values.tcPhoneNumber,
                        },
                      },
                    },
                  })
                }
              />
              {/* @NOTE we could put them together in an alias form LegalNameField */
              fieldName === 'LegalFirstNameField' && (
                <User.LegalLastNameField form="UserInfo" />
              )}
            </React.Fragment>
          )}
        </UpdateUser>
      )}
    </EditInfoLayout>
  ) : (
    <UserInfoTriggers
      fieldName={fieldName}
      onClose={onClose}
      onCompleted={handleToast}
      workType={userData.workType}
      triggerContext={triggerContext}
    >
      <InfoView
        breakpoints={breakpoints}
        onCancel={() => handleToast(triggerContext)}
        workType={userData.workType}
        goTo={goTo}
        popToast={popToast}
        triggerContext={triggerContext}
      />
    </UserInfoTriggers>
  );
};

EditInfo.propTypes = {
  fieldName: PropTypes.string.isRequired,
  metaData: PropTypes.object,
  userData: PropTypes.object,
  onClose: PropTypes.func,
  onCompleted: PropTypes.func,
  submit: PropTypes.func.isRequired,
  filingStatus: PropTypes.string,
  syncErrors: PropTypes.object,
  goTo: PropTypes.func.isRequired,
};

const withRedux = connect(
  state => ({
    filingStatus: formValueSelector('UserInfo')(state, 'filingStatus'),
    workType: formValueSelector('UserInfo')(state, 'workType'),
    estimatedW2Income: formValueSelector('UserInfo')(
      state,
      'estimatedW2Income',
    ),
    estimated1099Income: formValueSelector('UserInfo')(
      state,
      'estimated1099Income',
    ),
    isPristine: isPristine('UserInfo')(state),
    syncErrors: getFormSyncErrors('UserInfo')(state),
    isMutating: isSubmitting('UserInfo')(state),
  }),
  { submit, destroy, ...toastActions },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

const Component = enhance(EditInfo);

Component.displayName = 'EditInfo';

export default Component;
