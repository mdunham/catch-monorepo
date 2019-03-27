import React from 'react';
import PropTypes from 'prop-types';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  Hoverable,
  Divider,
  Icon,
  colors,
  borderRadius,
  styles as st,
} from '@catch/rio-ui-kit';
import { insuranceSourcesCopyUppercase, Env } from '@catch/utils';

const HealthInsuranceCard = ({
  carrier,
  planName,
  insuranceSource,
  viewport,
  policyNumber,
  phoneNumber,
  onEdit,
  notes,
  frontImageUrl,
  backImageUrl,
  toggleImage,
}) => (
  <Hoverable>
    {isHovered => (
      <TouchableOpacity onPress={onEdit} style={st.get(['Paper', styles.base])}>
        <View style={st.get(['CenterColumn', styles.header])}>
          <Text style={st.get(['H6', 'Bold', styles.headerText], viewport)}>
            COVERED THROUGH {insuranceSourcesCopyUppercase[insuranceSource]}
          </Text>
        </View>
        <View
          style={st.get(
            ['LgTopGutter', 'LgBottomGutter', 'LgMargins'],
            viewport,
          )}
        >
          <View style={st.get(['Bilateral', 'CenterColumn'])}>
            <Text style={st.get(['H4', styles.titleMax], viewport)}>
              {carrier}
            </Text>
            {(viewport === 'PhoneOnly' || isHovered) && (
              <Icon name="pencil" size={16} color={colors.ink} />
            )}
          </View>
          <Text
            style={st.get(['XsTopGutter', 'Body', styles.titleMax], viewport)}
          >
            {planName}
          </Text>

          <React.Fragment>
            {policyNumber && (
              <Divider
                color={colors.sage}
                style={st.get(['TopGutter', 'BottomGutter'])}
              />
            )}
            <View style={st.get('CenterLeftRow')}>
              {policyNumber && (
                <View style={st.get(phoneNumber && 'LgRightGutter')}>
                  <Text style={st.get('Body', viewport)}>Policy number</Text>
                  <Text style={st.get(['Body', 'Bold'], viewport)}>
                    {policyNumber}
                  </Text>
                </View>
              )}
              {policyNumber &&
                phoneNumber && <Divider color={colors.sage} vertical />}
              {phoneNumber && (
                <View style={st.get(policyNumber && 'LgLeftGutter')}>
                  <Text style={st.get('Body', viewport)}>Phone number</Text>
                  <TouchableWithoutFeedback
                    onPress={Platform.select({
                      web: () => {},
                      default: () => Linking.openURL(`tel:${phoneNumber}`),
                    })}
                  >
                    <View>
                      <Text
                        style={st.get(
                          [Env.isNative ? 'BodyLink' : 'Body', 'Bold'],
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
          </React.Fragment>

          {notes && (
            <View style={st.get('LgTopGutter')}>
              <Text style={st.get('Body', viewport)}>Notes</Text>
              <Text style={st.get('Body', viewport)}>{notes}</Text>
            </View>
          )}

          {frontImageUrl && (
            <TouchableWithoutFeedback>
              <TouchableOpacity onPress={() => toggleImage(frontImageUrl)}>
                <Image
                  source={{ uri: frontImageUrl }}
                  style={{
                    marginTop: 16,
                    width: '100%',
                    height: 160,
                    borderRadius: borderRadius.regular,
                    zIndex: 10,
                  }}
                />
              </TouchableOpacity>
            </TouchableWithoutFeedback>
          )}

          {backImageUrl && (
            <TouchableWithoutFeedback>
              <TouchableOpacity onPress={() => toggleImage(backImageUrl)}>
                <Image
                  source={{ uri: backImageUrl }}
                  style={{
                    marginTop: 16,
                    width: '100%',
                    height: 160,
                    borderRadius: borderRadius.regular,
                  }}
                />
              </TouchableOpacity>
            </TouchableWithoutFeedback>
          )}
        </View>
      </TouchableOpacity>
    )}
  </Hoverable>
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors['sage+1'],
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 24,
    paddingRight: 24,
  },
  headerText: {
    color: colors['algae-1'],
  },
  titleMax: {
    maxWidth: 250,
  },
});

HealthInsuranceCard.propTypes = {
  carrier: PropTypes.string.isRequired,
  planName: PropTypes.string.isRequired,
  insuranceSource: PropTypes.string.isRequired,
  viewport: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  notes: PropTypes.string,
  policyNumber: PropTypes.string,
  phoneNumber: PropTypes.string,
  frontImageUrl: PropTypes.string,
  backImageUrl: PropTypes.string,
  toggleImage: PropTypes.func.isRequired,
};

export default HealthInsuranceCard;
