import React from 'react';
import { View } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { Spinner, styles as st } from '@catch/rio-ui-kit';

import { PlanCheckupOptions } from '../components';

class PlanCheckupForm extends React.PureComponent {
  // If it's the last scene, the form submits itself
  // while showing a loading indicator
  componentDidMount() {
    const { isLastScene, handleSubmit, onCompleted } = this.props;
    if (isLastScene) {
      handleSubmit();
    }
  }
  render() {
    const { isLastScene } = this.props;
    return isLastScene ? (
      <View style={st.get('CenterColumn')}>
        <Spinner large />
      </View>
    ) : (
      <Field component={PlanCheckupOptions} {...this.props} />
    );
  }
}

export default reduxForm({
  form: 'planCheckup',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(PlanCheckupForm);
