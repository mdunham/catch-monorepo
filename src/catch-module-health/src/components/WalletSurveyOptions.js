import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';

import { OptionCard, styles as st } from '@catch/rio-ui-kit';

export const WalletSurveyOptions = ({
  input: { onChange, value },
  options,
  breakpoints,
  viewport,
}) => (
  <View
    style={st.get([
      breakpoints.select({
        'TabletLandscapeUp|TablePortraitUp': styles.wrapItems,
        PhoneOnly: 'CenterColumn',
      }),
    ])}
  >
    {Object.keys(options).map((option, idx, list) => (
      <View
        key={`option-${idx}`}
        style={st.get([
          'BottomGutter',
          viewport !== 'PhoneOnly' && list.length > 4 && 'RightGutter',
          'FullWidth',
          'ButtonMax',
        ])}
      >
        <OptionCard
          style={st.get('FullWidth')}
          title={options[option]}
          viewport={viewport}
          onClick={() => onChange(option)}
          checked={option === value}
          hoverEnabled
          checkMark
          simple
        />
      </View>
    ))}
  </View>
);

WalletSurveyOptions.propTypes = {
  breakpoints: PropTypes.object,
  input: PropTypes.shape({ onChange: PropTypes.func, value: PropTypes.string })
    .isRequired,
  options: PropTypes.object.isRequired,
  viewport: PropTypes.string,
};

const styles = StyleSheet.create({
  optionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  wrapItems: {
    flexWrap: 'wrap',
    maxWidth: 600,
    alignItems: 'center',
    width: '100%',
    maxHeight: 250,
  },
});

export default WalletSurveyOptions;
