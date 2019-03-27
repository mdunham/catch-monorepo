import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, ScrollView, Text } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { ReduxRadioGroup, Radio, Button, styles } from '@catch/rio-ui-kit';

import { createValidator, bankLinkMFA } from '@catch/utils';
import { QuestionLayout } from '../components';

function choiceToLabel({ category, possibleAnswer }) {
  if (!category || category === '') return possibleAnswer;
  return `${category}-${possibleAnswer}`;
}

export class BankMFAMultipleChoiceForm extends Component {
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
      invalid,
      isLoading,
      challenge,
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

        <Field
          name="answer"
          component={ReduxRadioGroup}
          label="Security Answer"
        >
          {/* We pass the index to backend to determine which choice was selected */}
          {challenge.choices.map((c, i) => (
            <Radio
              id={`${i}`}
              key={choiceToLabel(c)}
              py={2}
              value={`${i}`}
              mb={1}
              containerStyle={breakpoints.select({
                PhoneOnly: styles.get('Divider'),
              })}
            >
              <View style={styles.get('LeftGutter')}>
                <Text style={styles.get('FinePrint', breakpoints.current)}>
                  {c.category}
                </Text>
                <Text
                  style={styles.get(
                    ['FinePrint', 'SubtleText'],
                    breakpoints.current,
                  )}
                >
                  {c.possibleAnswer}
                </Text>
              </View>
            </Radio>
          ))}
        </Field>
      </QuestionLayout>
    );
  }
}

export default reduxForm({
  form: 'BankMFAMultipleChoiceForm',
  validate: createValidator(bankLinkMFA),
})(BankMFAMultipleChoiceForm);
