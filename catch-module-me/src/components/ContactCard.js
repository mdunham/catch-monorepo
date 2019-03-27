import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {
  Icon,
  styles,
  colors,
  borderRadius,
  Divider,
  Box,
} from '@catch/rio-ui-kit';
import { RELATIONSHIPS } from '@catch/utils';

const S = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors['ink+3'],
    borderRadius: borderRadius.regular,
  },
});

export const ContactCard = ({
  breakpoints,
  givenName,
  familyName,
  relation,
  onClick,
  isTrustedContact,
  isTaxDependent,
}) => (
  <TouchableOpacity
    onPress={onClick}
    style={styles.get(['Card', 'SmBottomSpace', S.card], breakpoints)}
  >
    <View style={styles.get(['CenterLeftRow'], breakpoints)}>
      <Icon style={styles.get('SmTopGutter')} size={42} name="person-blob" />
      <View style={styles.get(['LeftGutter', 'SmTopGutter'])}>
        <Text
          style={styles.get('H4', breakpoints.current)}
        >{`${givenName} ${familyName}`}</Text>
        {!!relation && (
          <Text style={styles.get('Body', breakpoints.current)}>{`${
            RELATIONSHIPS[relation]
          }`}</Text>
        )}
      </View>
    </View>
    {(isTrustedContact || isTaxDependent) && (
      <React.Fragment>
        <Divider mt={1} mb={2} color={colors.sage} />
        <React.Fragment>
          {isTrustedContact && (
            <Box mb={isTaxDependent ? 1 : 0} row>
              <Icon
                name="check"
                fill={colors['algae']}
                stroke={colors['algae']}
                strokeWidth={1}
                dynamicRules={{ paths: { fill: colors['algae'] } }}
                size={Platform.select({
                  web: 13,
                  default: 18,
                })}
                style={Platform.select({
                  web: styles.get('SmTopSpace', breakpoints),
                  default: styles.get('SmTopGutter', breakpoints),
                })}
              />
              <Text
                style={styles.get(
                  ['Body', 'SmLeftGutter'],
                  breakpoints.current,
                )}
              >
                Trusted contact for Retirement
              </Text>
            </Box>
          )}
          {isTaxDependent && (
            <Box row>
              <Icon
                name="check"
                fill={colors['algae']}
                stroke={colors['algae']}
                strokeWidth={1}
                dynamicRules={{ paths: { fill: colors['algae'] } }}
                size={Platform.select({
                  web: 13,
                  default: 18,
                })}
                style={Platform.select({
                  web: styles.get('SmTopSpace', breakpoints),
                  default: styles.get('SmTopGutter', breakpoints),
                })}
              />
              <Text
                style={styles.get(
                  ['Body', 'SmLeftGutter'],
                  breakpoints.current,
                )}
              >
                Dependent for Tax Withholding
              </Text>
            </Box>
          )}
        </React.Fragment>
      </React.Fragment>
    )}
  </TouchableOpacity>
);

ContactCard.propTypes = {
  breakpoints: PropTypes.object,
  givenName: PropTypes.string.isRequired,
  familyName: PropTypes.string.isRequired,
  relation: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ContactCard;
