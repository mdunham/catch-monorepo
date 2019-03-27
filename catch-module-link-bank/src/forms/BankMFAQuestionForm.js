import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, Text, View } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { styles, ReduxInput } from '@catch/rio-ui-kit';

import { createValidator, bankLinkMFA, Env } from '@catch/utils';
import { QuestionLayout } from '../components';

export class BankMFAQuestionForm extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    challenge: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    isLoading: false,
  };
  d;
  render() {
    const {
      challenge,
      isLoading,
      invalid,
      handleSubmit,
      breakpoints,
      bankIcon,
      title,
    } = this.props;
    return (
      <QuestionLayout
        title={title}
        bankIcon={bankIcon}
        breakpoints={breakpoints}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        invalid={invalid}
      >
        <Text
          style={styles.get(
            ['FieldLabel', 'LgBottomGutter'],
            breakpoints.current,
          )}
        >
          Security Question
        </Text>
        <Text
          style={styles.get(['Body', 'LgBottomGutter'], breakpoints.current)}
        >
          {challenge.question}
        </Text>

        {!!challenge.image &&
          !!challenge.image.imageUri && (
            <View style={styles.get('LgBottomGutter')}>
              <Image source={{ uri: challenge.image.imageUri }} />
            </View>
          )}

        <Field
          qaName="answer"
          name="answer"
          component={ReduxInput}
          label="Security Answer"
          className="_lr_hide"
        />
      </QuestionLayout>
    );
  }
}

export default reduxForm({
  form: 'BankMFAQuestionForm',
  validate: createValidator(bankLinkMFA),
})(BankMFAQuestionForm);
