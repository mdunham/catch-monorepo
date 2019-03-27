import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Figure, Fader } from '@catch/rio-ui-kit';
import { onboardingSteps as stps } from '../store/duck';

const styles = StyleSheet.create({
  ellipse: {
    position: 'absolute',
    top: 128,
    left: 0,
  },
  cube: {
    position: 'absolute',
    top: 248,
    right: 0,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  dot: {
    position: 'absolute',
    left: 100,
    bottom: 268,
  },
  triangle: {
    position: 'absolute',
    top: 97,
    left: 216,
  },
});

const visibleFigures = step => {
  return [
    <View style={styles.dot} key="dot">
      <Fader durationIn={2500} show={step === stps.INFO}>
        <Figure name="onboardingDot" />
      </Fader>
    </View>,
    <View style={styles.triangle} key="triangle">
      <Fader
        durationIn={2500}
        show={step === stps.INFO || step === stps.WORKTYPE}
      >
        <Figure name="onboardingTriangle" />
      </Fader>
    </View>,
    <View style={styles.ellipse} key="ellipse">
      <Fader
        durationIn={2500}
        show={
          step === stps.INFO || step === stps.CREATE || step === stps.WORKTYPE
        }
      >
        <Figure name="onboardingEllipse" />
      </Fader>
    </View>,
    <View style={styles.cube} key="cube">
      <Fader
        durationIn={2500}
        show={
          step === stps.INFO ||
          step === stps.CONFIRM ||
          step === stps.CREATE ||
          step === stps.WORKTYPE
        }
      >
        <Figure name="onboardingRect" />
      </Fader>
    </View>,
    <View style={styles.wave} key="wave">
      <Fader
        durationIn={2500}
        show={
          step === stps.INFO ||
          step === stps.CONFIRM ||
          step === stps.CREATE ||
          step === stps.REGISTER ||
          step === stps.WORKTYPE
        }
      >
        <Figure name="onboardingWave" />
      </Fader>
    </View>,
  ];
};

export default visibleFigures;
