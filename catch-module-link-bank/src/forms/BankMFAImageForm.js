import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Platform, View, ScrollView, Text, Image } from 'react-native';

import { createValidator, bankLinkMFA } from '@catch/utils';
import { Button, styles, ReduxInput } from '@catch/rio-ui-kit';

import { QuestionLayout } from '../components';

export class BankMFAImageForm extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    challenge: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    isLoading: false,
  };
  render() {
    const {
      challenge,
      isLoading,
      invalid,
      handleSubmit,
      title,
      bankIcon,
      breakpoints,
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
        <Image
          source={Platform.select({
            web: challenge.image.imageUri,
            default: {
              uri: challenge.image.imageUri,
            },
          })}
          style={{
            width: 300,
            height: 100,
            resizeMode: 'contain',
          }}
        />

        <Text
          style={styles.get(
            ['Body', 'TopGutter', 'LgBottomGutter'],
            breakpoints.current,
          )}
        >
          {challenge.question}
        </Text>

        <Field
          name="answer"
          component={ReduxInput}
          label="Security Answer"
          onSubmit={handleSubmit}
        />
      </QuestionLayout>
    );
  }
}

export default reduxForm({
  form: 'BankMFAImageForm',
  validate: createValidator(bankLinkMFA),
})(BankMFAImageForm);
