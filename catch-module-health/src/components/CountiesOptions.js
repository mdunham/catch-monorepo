import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

import { OptionCard, styles as st, colors } from '@catch/rio-ui-kit';
import { STATES } from '@catch/utils';

const CountiesOptions = ({
  counties,
  viewport,
  input: { onChange, value },
}) => (
  <React.Fragment>
    <View accessibilityLabel="Divider" style={styles.divider} />
    <Text style={st.get(['H3', 'BottomGutter'], viewport)}>
      Where exactly do you live?
    </Text>
    <Text style={st.get(['Body', 'XlBottomGutter'], viewport)}>
      Your zip code matches multiple counties.
    </Text>
    {counties.map((county, i) => (
      <View
        style={st.get(['BottomGutter', 'ButtonMax', 'FullWidth'])}
        key={`${county.fips}-${i}`}
      >
        <OptionCard
          simple
          checkMark
          style={st.get('FullWidth')}
          onClick={() => onChange(i)}
          checked={value === i}
          viewport={viewport}
          title={county.name}
          subtitle={STATES[county.state]}
          hoverEnabled
        />
      </View>
    ))}
  </React.Fragment>
);

CountiesOptions.propTypes = {
  counties: PropTypes.array.isRequired,
  viewport: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  divider: {
    opacity: 0.1,
    height: 2,
    width: '100%',
    maxWidth: 280,
    backgroundColor: colors.ink,
    marginTop: 34,
    marginBottom: 40,
  },
});

export default CountiesOptions;
