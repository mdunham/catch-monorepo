import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import { Icon, styles, colors } from '@catch/rio-ui-kit';
import { RELATIONSHIPS } from '@catch/utils';

export const ContactDetails = ({
  breakpoints,
  givenName,
  familyName,
  email,
  phoneNumber,
  relation,
  isTaxDependent,
  isTrustedContact,
}) => (
  <React.Fragment>
    {(isTaxDependent || isTrustedContact) && (
      <View style={styles.get('BottomGutter')}>
        <Text style={styles.get('FieldLabel', breakpoints.current)}>
          Plan connections
        </Text>
        <View style={styles.get('SmTopGutter')}>
          {isTaxDependent && (
            <View style={styles.get('CenterLeftRow', breakpoints)}>
              <Icon
                name="check"
                fill={colors['algae']}
                stroke={colors['algae']}
                strokeWidth={1}
                dynamicRules={{ paths: { fill: colors['algae'] } }}
                size={13}
                style={styles.get('XsTopGutter', breakpoints)}
              />
              <Text
                style={styles.get(
                  [
                    'Body',
                    isTrustedContact && 'SmBottomGutter',
                    'SmLeftGutter',
                  ],
                  breakpoints.current,
                )}
              >
                Tax dependent
              </Text>
            </View>
          )}
          {isTrustedContact && (
            <View style={styles.get('CenterLeftRow')}>
              <Icon
                name="check"
                fill={colors['algae']}
                stroke={colors['algae']}
                strokeWidth={1}
                dynamicRules={{ paths: { fill: colors['algae'] } }}
                size={13}
                style={styles.get('XsTopGutter')}
              />
              <Text
                style={styles.get(
                  ['Body', 'SmLeftGutter'],
                  breakpoints.current,
                )}
              >
                Retirement trusted contact
              </Text>
            </View>
          )}
        </View>
      </View>
    )}

    <Text style={styles.get(['FieldLabel'], breakpoints.current)}>
      Legal name
    </Text>
    <Text style={styles.get(['Body', 'SmTopGutter'], breakpoints.current)}>
      {givenName} {familyName}
    </Text>

    <Text style={styles.get(['FieldLabel', 'TopGutter'], breakpoints.current)}>
      Relation to you
    </Text>
    <Text style={styles.get(['Body', 'SmTopGutter'], breakpoints.current)}>
      {RELATIONSHIPS[relation]}
    </Text>

    {email && (
      <View>
        <Text
          style={styles.get(['FieldLabel', 'TopGutter'], breakpoints.current)}
        >
          Email address
        </Text>
        <Text style={styles.get(['Body', 'SmTopGutter'], breakpoints.current)}>
          {email}
        </Text>
      </View>
    )}

    {phoneNumber && (
      <View>
        <Text
          style={styles.get(['FieldLabel', 'TopGutter'], breakpoints.current)}
        >
          Phone number
        </Text>
        <Text style={styles.get(['Body', 'SmTopGutter'], breakpoints.current)}>
          {phoneNumber}
        </Text>
      </View>
    )}
  </React.Fragment>
);

export default ContactDetails;
