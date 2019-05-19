import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { HomeCard } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.home.LockedOutCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  body: <FormattedMessage id={`${PREFIX}.body`} />,
  buttonText: <FormattedMessage id={`${PREFIX}.buttonText`} />,
};

const LockedOutCard = ({ onStart, viewport }) => (
  <HomeCard
    title={COPY['title']}
    subtitle={COPY['body']}
    buttonText={COPY['buttonText']}
    onClick={onStart}
    viewport={viewport}
  />
);

LockedOutCard.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default LockedOutCard;
