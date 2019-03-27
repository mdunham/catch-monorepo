import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getFormValues, isValid, submit } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import access from 'safe-access';

import { styles, withDimensions } from '@catch/rio-ui-kit';
import { getRouteState, goTo } from '@catch/utils';

import { Page } from '../components';
import { AddDoctors } from '../containers';
import { AddDoctorsForm } from '../forms';

const PREFIX = 'catch.health.AddDoctorsView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  save: <FormattedMessage id={`${PREFIX}.save`} />,
  skip: <FormattedMessage id={`${PREFIX}.skip`} />,
  cancel: <FormattedMessage id={`${PREFIX}.cancel`} />,
};

export class AddDoctorsView extends React.PureComponent {
  static propTypes = {
    breakpoints: PropTypes.object.isRequired,
    isValid: PropTypes.bool,
    submitForm: PropTypes.func.isRequired,
    viewport: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
  }

  /**
   * Handles submitting the form to the API
   *
   * @param {function} addDoctors - the mutation
   * @param {array} doctors - the doctors beings saved
   */
  handleSubmit = (addDoctors, doctors) => {
    // If a doctor's `otherType` is defined, use that as the type attribute
    const newDoctors = doctors.map((doc, i) => ({
      ...doctors[i],
      type:
        doctors[i].type === 'OTHER' ? doctors[i].otherType : doctors[i].type,
    }));

    addDoctors({
      variables: {
        input: newDoctors,
      },
    });
  };

  handleBack = () => {
    this.goTo('/plan/health/wallet/add');
  };

  handleCompleted = () => {
    const onCompletedRoute = access(this.getRouteState(), 'onCompletedRoute');
    this.goTo(onCompletedRoute || '/guide', {}, 'RESET');
  };

  goToBackRoute = () => {
    const onBackRoute = access(this.getRouteState(), 'onBackRoute');
    this.goTo(onBackRoute);
  };

  render() {
    const {
      breakpoints,
      formValues,
      isValid,
      submitForm,
      viewport,
    } = this.props;

    const onCompletedRoute = access(this.getRouteState(), 'onCompletedRoute');
    const onBackRoute = access(this.getRouteState(), 'onBackRoute');

    return (
      <AddDoctors onCompleted={this.handleCompleted}>
        {({ addDoctors, loading }) => (
          <Page
            title={COPY['title']}
            titleIcon="health"
            titleIconSize={66}
            viewport={viewport}
            rightSecondaryAction={
              (!onCompletedRoute && this.handleCompleted) ||
              (onBackRoute && this.goToBackRoute)
            }
            rightSecondaryActionText={
              onBackRoute ? COPY['cancel'] : COPY['skip']
            }
            topNavLeftAction={this.handleBack}
            renderTopNav={Platform.OS === 'web' && 'scroll'}
            centerBody
            centerTitle
            narrowTitle
            actions={[
              {
                onClick: submitForm,
                disabled: loading || !isValid,
                children: COPY['save'],
              },
            ]}
          >
            <View
              style={styles.get([
                'FullWidth',
                viewport !== 'PhoneOnly' && 'ContentMax',
              ])}
            >
              <AddDoctorsForm
                breakpoints={breakpoints}
                formValues={formValues}
                viewport={viewport}
                onSubmit={({ doctors }) =>
                  this.handleSubmit(addDoctors, doctors)
                }
              />
            </View>
          </Page>
        )}
      </AddDoctors>
    );
  }
}

const withRedux = connect(
  state => ({
    isValid: isValid('AddDoctorsForm')(state),
    formValues: getFormValues('AddDoctorsForm')(state),
  }),
  { submitForm: () => submit('AddDoctorsForm') },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

const Component = enhance(AddDoctorsView);
Component.displayName = 'AddDoctorsView';

export default Component;
