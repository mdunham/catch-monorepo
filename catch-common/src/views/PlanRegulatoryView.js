import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { View } from 'react-native';
import { compose } from 'redux';

import { Box, Text, Spinner, withDimensions, styles } from '@catch/rio-ui-kit';
import {
  goTo,
  getRouteState,
  getParentRoute,
  navigationPropTypes,
  Env,
} from '@catch/utils';
import { UserInfo, UpdateUser } from '../containers';
import { RegulatoryForm } from '../forms';
import { FlowLayout, SmallPageTitle } from '../components';

const PREFIX = 'catch.plans.PlanRegulatoryView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
};

export class PlanRegulatoryView extends Component {
  static propTypes = {
    formValues: PropTypes.object,
    moduleName: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
    this.getParentRoute = getParentRoute.bind(this);
  }

  handleBack = () => {
    const rootPath = this.getParentRoute();

    this.goTo([rootPath, '/legal']);
  };

  handleNext = () => {
    const { formValues } = this.props;
    const rootPath = this.getParentRoute();

    if (
      !formValues.isControlPerson &&
      !formValues.isFirmAffiliated &&
      !formValues.isPoliticallyExposed
    ) {
      this.goTo([rootPath, '/agreement'], {
        prevPath: [rootPath, '/regulatory'],
      });
    } else {
      this.goTo([rootPath, '/ineligible'], {
        prevPath: [rootPath, '/regulatory'],
      });
    }
  };

  render() {
    const { formValues, breakpoints, viewport } = this.props;

    const canClickNext =
      formValues &&
      formValues.isControlPerson !== null &&
      formValues.isPoliticallyExposed !== null &&
      formValues.isFirmAffiliated !== null;

    return (
      <UserInfo>
        {({
          loading,
          isControlPerson,
          isFirmAffiliated,
          isPoliticallyExposed,
        }) =>
          loading ? null : (
            <UpdateUser onCompleted={this.handleNext}>
              {({ loading, updateUser }) => {
                return (
                  <FlowLayout
                    onNext={() =>
                      updateUser({ variables: { input: { ...formValues } } })
                    }
                    canClickNext={canClickNext}
                    isLoading={loading}
                  >
                    <View
                      style={styles.get(
                        [
                          'FormMax',
                          'TopSpace',
                          'LgBottomGutter',
                          breakpoints.select({ PhoneOnly: 'SmMargins' }),
                        ],
                        viewport,
                      )}
                    >
                      <SmallPageTitle title={COPY['title']} />
                      <Text>{COPY['subtitle']}</Text>

                      <RegulatoryForm
                        initialValues={{
                          isControlPerson,
                          isFirmAffiliated,
                          isPoliticallyExposed,
                        }}
                      />
                    </View>
                  </FlowLayout>
                );
              }}
            </UpdateUser>
          )
        }
      </UserInfo>
    );
  }
}

const withRedux = connect(state => ({
  formValues: getFormValues('RegulatoryForm')(state),
}));

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(PlanRegulatoryView);
