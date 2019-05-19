import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { HomeCard } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.home.AllGoalsPausedCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  body: <FormattedMessage id={`${PREFIX}.body`} />,
  buttonText: <FormattedMessage id={`${PREFIX}.buttonText`} />,
};

/**
 * This component breaks down copy implementation to avoid crowding views 
 */
const AllGoalsPausedCard = ({ onStart, viewport }) => (
  <HomeCard
    title={COPY['title']}
    subtitle={COPY['body']}
    buttonText={COPY['buttonText']}
    onClick={onStart}
    viewport={viewport}
  />
);

AllGoalsPausedCard.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default AllGoalsPausedCard;
