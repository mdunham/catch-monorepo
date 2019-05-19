import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { HomeCard } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.home.PlanStartedCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  body: <FormattedMessage id={`${PREFIX}.body`} />,
  buttonText: <FormattedMessage id={`${PREFIX}.buttonText`} />,
};

/**
 * This component breaks down copy implementation to avoid crowding views
 */
const PlanStartedCard = ({ onContinue, viewport }) => (
  <HomeCard
    inverted
    title={COPY['title']}
    subtitle={COPY['body']}
    buttonText={COPY['buttonText']}
    onClick={onContinue}
    viewport={viewport}
    m={1}
  />
);

PlanStartedCard.propTypes = {
  onContinue: PropTypes.func.isRequired,
};

export default PlanStartedCard;
