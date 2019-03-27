import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ScrollView, StyleSheet } from 'react-native';

import {
  Button,
  OptionCard,
  borderRadius,
  withDimensions,
  styles as st,
} from '@catch/rio-ui-kit';

export function createAction(
  isActive,
  value,
  questionType,
  answerKey,
  onChange,
  cb,
) {
  if (!isActive) return () => {};
  if (/MULTIPLE/.test(questionType)) {
    const checked = value.includes(answerKey);
    if (checked) {
      return () => {
        const values = value.filter(val => val !== answerKey);
        onChange(values);
      };
    }
    return () => {
      const values = (value || []).concat([answerKey]);
      onChange(values);
    };
  } else {
    return () => {
      onChange([answerKey]);
      setTimeout(cb, 200);
    };
  }
}
const PlanCheckupOptions = ({
  question,
  answers,
  onNext,
  input: { onChange, value },
  viewport,
  breakpoints,
  isActive,
  questionType,
  ...other
}) => (
  <ScrollView contentContainerStyle={st.get('CenterColumn')}>
    <Text
      style={st.get(
        [
          'H3',
          'CenterText',
          'XlBottomGutter',
          /MULTIPLE/.test(questionType) ? 'ContentMax' : 'ButtonMax',
        ],
        viewport,
      )}
    >
      {question}
    </Text>
    <View
      style={[
        styles.optionContainer,
        ...breakpoints.select({
          'TabletLandscapeUp|TabletPortraitUp': [
            /MULTIPLE/.test(questionType) && styles.wrapItems,
            answers.length > 6 && styles.wrapDeep,
          ],
          PhoneOnly: [],
        }),
      ]}
    >
      {answers.map(answer => (
        <View
          style={st.get([
            'BottomGutter',
            'ButtonMax',
            'FullWidth',
            /MULTIPLE/.test(questionType) &&
              breakpoints.select({
                'TabletLandscapeUp|TabletPortraitUp': 'RightGutter',
              }),
          ])}
          key={answer.id}
        >
          <OptionCard
            simple
            checkMark={/MULTIPLE/.test(questionType)}
            style={st.get('FullWidth')}
            onClick={createAction(
              isActive,
              value,
              questionType,
              answer.id,
              onChange,
              onNext,
            )}
            checked={Array.isArray(value) && value.includes(answer.id)}
            viewport={viewport}
            title={answer.text}
            subtitle={answer.subtitle}
            hoverEnabled
          />
        </View>
      ))}
    </View>
    {/MULTIPLE/.test(questionType) && (
      <View style={st.get(['FullWidth', 'ButtonMax', 'XlBottomGutter'])}>
        <Button wide onClick={onNext} viewport={viewport}>
          Next
        </Button>
      </View>
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  optionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  wrapItems: {
    flexWrap: 'wrap',
    maxHeight: 230,
    maxWidth: 574,
  },
  wrapDeep: {
    maxHeight: 250,
  },
});

export default PlanCheckupOptions;
