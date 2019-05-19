import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { format } from 'date-fns';

import { HomeCard, Icon } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.home.BankLinkErrorCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: values => (
    <FormattedMessage id={`${PREFIX}.subtitle`} values={values} />
  ),
  finePrint: values => (
    <FormattedMessage id={`${PREFIX}.finePrint`} values={values} />
  ),
  buttonText: <FormattedMessage id={`${PREFIX}.buttonText`} />,
};

const BankLinkErrorCard = ({
  onContinue,
  viewport,
  bankName,
  lastBankLinkUpdate,
}) => (
  <HomeCard
    title={COPY['title']}
    subtitle={COPY['subtitle']({ bankName })}
    finePrint={COPY['finePrint']({
      lastUpdated: format(lastBankLinkUpdate, 'H:mm A M/DD/YYYY'),
    })}
    buttonText={COPY['buttonText']}
    viewport={viewport}
    icon={
      <Icon
        name="warning"
        dynamicRules={{
          paths: [{ fill: '#ffb638' }, { fill: '#fff' }],
        }}
        size={22}
      />
    }
    onClick={onContinue}
  />
);

BankLinkErrorCard.propTypes = {
  onContinue: PropTypes.func.isRequired,
};

export default BankLinkErrorCard;
