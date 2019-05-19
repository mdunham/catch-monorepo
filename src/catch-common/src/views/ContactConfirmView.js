import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import { colors, Divider, styles } from '@catch/rio-ui-kit';

import { ContactDetails } from '../components';

const ContactConfirmView = ({
  givenName,
  familyName,
  isTrustedContact,
  isTaxDependent,
  email,
  relation,
  phoneNumber,
  hasTaxGoal,
  breakpoints,
}) => (
  <React.Fragment>
    <ContactDetails
      givenName={givenName}
      familyName={familyName}
      breakpoints={breakpoints}
      relation={relation}
      email={email}
      phoneNumber={phoneNumber}
      breakpoints={breakpoints}
    />
    {isTrustedContact && (
      <React.Fragment>
        <Divider
          style={styles.get(['TopGutter', 'BottomGutter'])}
          color={colors.sage}
        />
        <Text
          style={styles.get(
            ['FieldLabel', 'SmBottomGutter'],
            breakpoints.current,
          )}
        >
          Trusted contacts
        </Text>
        <Text style={styles.get('FinePrintLight', breakpoints.current)}>
          You authorize us to contact your trusted contact and disclose to your
          trusted contact information about your account in the following
          circumstances: to address possible financial exploitation, to confirm
          the specifics of your current contact information, health status, or
          the identity of any legal guardian, executor, trustee or other holder
          of a power of attorney, or as otherwise permitted by FINRA Rule 2165
          (Financial Exploitation of Specified Adults).
        </Text>
      </React.Fragment>
    )}
  </React.Fragment>
);

export default ContactConfirmView;
