import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View, Platform } from 'react-native';
import { compose } from 'redux';
import { connect } from 'react-redux';
import access from 'safe-access';
import { getFormValues, submit, isDirty, isValid } from 'redux-form';

import { colors, Icon, styles as st, withDimensions } from '@catch/rio-ui-kit';
import {
  goTo,
  goBack,
  getRouteState,
  doctorInput,
  createValidator,
} from '@catch/utils';

import { Page } from '../components';
import { DeleteDoctor, Doctors, UpsertDoctor } from '../containers';
import { DoctorForm } from '../forms';

const DOCTOR_TYPES = [
  'PRIMARY_CARE_PHYSICIAN',
  'OB-GYN',
  'DERMATOLOGIST',
  'EAR_NOSE_THROAT',
  'PSYCHIATRIST',
  'ORTHOPEDIC_SURGEON',
  'EYE_DOCTOR',
  'DENTIST',
  'PEDIATRICIAN',
  'OTHER',
];

export class EditDoctorView extends React.PureComponent {
  static propTypes = {
    breakpoints: PropTypes.object.isRequired,
    isValid: PropTypes.bool,
    submitForm: PropTypes.func.isRequired,
    viewport: PropTypes.string.isRequired,
    isDirty: PropTypes.bool,
    formValues: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.goTo = goTo.bind(this);
    this.goBack = goBack.bind(this);
    this.getRouteState = getRouteState.bind(this);
  }

  handleBack = () => {
    if (Platform.OS === 'web') {
      this.goTo('/plan/health/overview');
    } else {
      this.goBack('modal');
    }
  };

  /**
   * Handler for submitting the form values
   *
   * @param {function} upsertDoctor - the function to save the record to our db
   * @param {object} values - the form values
   * @param {string} id - the id of the doctor in our db
   */
  handleSubmit = (upsertDoctor, values, id) => {
    /**
     * @Note if we don't pass the id in the upsert, the mutation adds a new doctor. The id is required
     * for a pure update
     */

    const saveValues = {
      ...values,
      type: values.type === 'OTHER' ? values.otherType : values.type,
    };

    upsertDoctor({
      variables: {
        input: {
          id,
          ...saveValues,
        },
      },
    });
  };

  render() {
    const {
      breakpoints,
      formValues,
      isDirty,
      isValid,
      submitForm,
      viewport,
    } = this.props;

    const doctorId = access(this.getRouteState(), 'doctorId');

    return (
      <Doctors>
        {({ doctors }) => {
          let initialValues =
            doctors && doctors.find(doctor => doctor.id === doctorId);

          initialValues = !DOCTOR_TYPES.includes(initialValues.type)
            ? { ...initialValues, type: 'OTHER', otherType: initialValues.type }
            : initialValues;

          return (
            <UpsertDoctor onCompleted={this.handleBack}>
              {({ upsertDoctor, loading }) => (
                <Page
                  viewport={viewport}
                  breakpoints={breakpoints}
                  topNavLeftAction={this.handleBack}
                  actions={[
                    {
                      onClick: submitForm,
                      children: 'Save',
                      disabled: !isValid || loading,
                    },
                  ]}
                  centerBody
                  renderTopNav={Platform.OS === 'web' ? 'scroll' : 'fixed'}
                  rightSecondaryAction={this.handleBack}
                  rightSecondaryActionText="Cancel"
                  topNavLeftIcon={
                    Platform.OS !== 'web'
                      ? {
                          name: 'close',
                          dynamicRules: { paths: { fill: colors.ink } },
                          size: 30,
                        }
                      : undefined
                  }
                  topNavTitle={Platform.OS !== 'web' && 'Edit Doctor Details'}
                  topNavRightComponent={
                    <DeleteDoctor onCompleted={this.handleBack}>
                      {({ deleteDoctor, loading: deleting }) => (
                        <TouchableOpacity
                          style={st.get(['Row', 'CenterColumn'])}
                          onPress={() =>
                            deleteDoctor({ variables: { id: doctorId } })
                          }
                        >
                          <Icon
                            name="trash"
                            size={viewport === 'PhoneOnly' ? 22 : 16}
                            fill={colors['coral-2']}
                            stroke={colors['coral-2']}
                            dynamicRules={{
                              paths: {
                                fill: colors['coral-2'],
                                stroke: colors['coral-2'],
                              },
                            }}
                          />
                          {viewport !== 'PhoneOnly' && (
                            <Text
                              style={st.get(
                                ['Body', 'Warning', 'Medium', 'SmLeftGutter'],
                                viewport,
                              )}
                            >
                              Delete doctor
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </DeleteDoctor>
                  }
                >
                  <View
                    style={st.get([
                      'FullWidth',
                      'TopGutter',
                      viewport !== 'PhoneOnly' && 'ContentMax',
                    ])}
                  >
                    <DoctorForm
                      name="name"
                      phoneNumber="phoneNumber"
                      otherType="otherType"
                      type="type"
                      form="EditDoctorForm"
                      formValues={formValues}
                      initialValues={initialValues}
                      validate={createValidator(doctorInput)}
                      isDirty={isDirty}
                      onSubmit={values =>
                        this.handleSubmit(upsertDoctor, values, doctorId)
                      }
                      isEditing
                    />
                  </View>
                </Page>
              )}
            </UpsertDoctor>
          );
        }}
      </Doctors>
    );
  }
}

const withRedux = connect(
  state => ({
    isValid: isValid('EditDoctorForm')(state),
    isDirty: isDirty('EditDoctorForm')(state),
    formValues: getFormValues('EditDoctorForm')(state),
  }),
  {
    submitForm: () => submit('EditDoctorForm'),
  },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

const Component = enhance(EditDoctorView);

export default Component;
