import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { HomeCard, Icon } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.home.IdVerificationCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  body: <FormattedMessage id={`${PREFIX}.body`} />,
  buttonText: <FormattedMessage id={`${PREFIX}.buttonText`} />,
};

const IdVerificationCard = ({ onContinue, viewport }) => (
  <HomeCard
    title={COPY['title']}
    subtitle={COPY['body']}
    buttonText={COPY['buttonText']}
    onClick={onContinue}
    viewport={viewport}
    m={1}
    icon={
      <Icon
        name="warning"
        dynamicRules={{
          paths: [{ fill: '#ffb638' }, { fill: '#fff' }],
        }}
        size={22}
      />
    }
  />
);

IdVerificationCard.propTypes = {
  onContinue: PropTypes.func.isRequired,
};

export default IdVerificationCard;
