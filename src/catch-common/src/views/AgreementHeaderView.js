import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { StyleSheet, View } from 'react-native';

import { Box, Text, H3, colors, animations, styles } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.plan.AgreementHeaderView';
export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  agreementDescription: values => (
    <FormattedMessage id={`${PREFIX}.agreementDescription`} values={values} />
  ),
  description1: <FormattedMessage id={`${PREFIX}.description1`} />,
  description2: <FormattedMessage id={`${PREFIX}.description2`} />,
  savingsAccount: <FormattedMessage id={`${PREFIX}.savingsAccount`} />,
  retirementAccount: <FormattedMessage id={`${PREFIX}.retirementAccount`} />,
};

const localStyles = StyleSheet.create({
  base: {
    backgroundColor: colors.ghost,

    ...animations.fadeInNext,
  },
});

const AgreementHeaderView = ({
  accountType,
  agreementNumber,
  totalAgreements,
  retirement,
  viewport,
}) => (
  <View style={styles.get(['FullWidth', 'CenterColumn', localStyles.base])}>
    <View
      style={styles.get(
        ['FullWidth', 'Margins', 'PageWrapper', 'TopGutter', 'BottomGutter'],
        viewport,
      )}
    >
      <H3 mb={1} weight="bold">
        {COPY['title']({ accountType })}
      </H3>
      <Text mb={2} color="charcoal--light1" weight="medium">
        {COPY['agreementDescription']({ agreementNumber, totalAgreements })}
      </Text>
      {retirement ? (
        <Text style={styles.get('FormMax')}>{COPY['retirementAccount']}</Text>
      ) : (
        <React.Fragment>
          <Text mb={1}>{COPY['description1']}</Text>
          <Text>{COPY['description2']}</Text>
        </React.Fragment>
      )}
    </View>
  </View>
);

AgreementHeaderView.propTypes = {
  agreementNumber: PropTypes.number,
  accountType: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  totalAgreements: PropTypes.number,
  retirement: PropTypes.bool,
};

AgreementHeaderView.defaultProps = {
  agreementNumber: 1,
  accountType: COPY['savingsAccount'],
  totalAgreements: 1,
  retirement: false,
};

export default AgreementHeaderView;
