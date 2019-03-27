import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Linking,
} from 'react-native';

import {
  colors,
  Divider,
  Hoverable,
  Icon,
  styles as st,
} from '@catch/rio-ui-kit';
import { Env } from '@catch/utils';

const DOCTOR_TYPES = {
  PRIMARY_CARE_PHYSICIAN: 'Primary care physician',
  'OB-GYN': 'OB-GYN (Obstetrician-Gynecologist)',
  DERMATOLOGIST: 'Dermatologist',
  EAR_NOSE_THROAT: 'Ear, nose, & throat doctor',
  PSYCHIATRIST: 'Psychiatrist',
  ORTHOPEDIC_SURGEON: 'Orthopedic surgeon',
  EYE_DOCTOR: 'Eye doctor',
  DENTIST: 'Dentist',
  PEDIATRICIAN: 'Pediatrician',
  OTHER: 'Other',
};

const DoctorCard = ({ name, type, phoneNumber, onEdit, viewport }) => (
  <Hoverable>
    {isHovered => (
      <TouchableOpacity
        onPress={onEdit}
        style={st.get(
          ['Paper', 'FullWidth', 'LgMargins', styles.base],
          viewport,
        )}
      >
        <View style={st.get(['TopGutter', 'BottomGutter'])}>
          <View style={st.get('CenterLeftRow')}>
            <Icon name="doctor" size={27} />
            <View
              style={st.get([
                'LeftGutter',
                'Flex1',
                'FullWidth',
                'Bilateral',
                viewport,
              ])}
            >
              <View>
                <Text style={st.get('H4', viewport)}>{name}</Text>
                <Text style={st.get('Body', viewport)}>
                  {DOCTOR_TYPES[type] || type}
                </Text>
              </View>
              {(viewport === 'PhoneOnly' || isHovered) && (
                <Icon name="pencil" style={st.get('XsRightGutter')} size={16} />
              )}
            </View>
          </View>
          {phoneNumber && (
            <View style={styles.phoneContainer}>
              <Divider my={2} color={colors.sage} />
              <TouchableWithoutFeedback
                onPress={Platform.select({
                  web: () => {},
                  default: () => Linking.openURL(`tel:${phoneNumber}`),
                })}
              >
                <View>
                  <Text
                    style={st.get(
                      [Env.isNative ? 'BodyLink' : 'Body', 'Medium'],
                      viewport,
                    )}
                  >
                    {phoneNumber}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )}
  </Hoverable>
);

DoctorCard.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  viewport: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
  },
  divider: {
    width: 246,
  },
  phoneContainer: {
    marginLeft: 43,
  },
});

export default DoctorCard;
