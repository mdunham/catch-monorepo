import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { colors, styles, Divider } from '@catch/rio-ui-kit';

import { ContactDetails } from '../components';

export const ContactDetailsView = ({
  onEdit,
  givenName,
  familyName,
  relation,
  email,
  phoneNumber,
  isTaxDependent,
  isTrustedContact,
  breakpoints,
}) => (
  <View>
    <View>
      <Text
        style={styles.get('H4', breakpoints.current)}
      >{`${givenName} ${familyName}`}</Text>
      <Text
        style={styles.get('BodyLink', breakpoints.current)}
        onPress={onEdit}
      >
        Edit contact
      </Text>
    </View>

    <Divider
      color={colors.sage}
      style={styles.get(['TopGutter', 'BottomGutter'], breakpoints)}
    />
    <ContactDetails
      givenName={givenName}
      familyName={familyName}
      breakpoints={breakpoints}
      relation={relation}
      email={email}
      phoneNumber={phoneNumber}
      isTaxDependent={isTaxDependent}
      isTrustedContact={isTrustedContact}
      breakpoints={breakpoints}
    />
  </View>
);

ContactDetailsView.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  givenName: PropTypes.string.isRequired,
  familyName: PropTypes.string.isRequired,
  isTrustedContact: PropTypes.bool,
  isTaxDependent: PropTypes.bool,
  relation: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ContactDetailsView;
