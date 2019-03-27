import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { HomeCard } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.home.NoPlanCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  body: <FormattedMessage id={`${PREFIX}.body`} />,
  button: <FormattedMessage id={`${PREFIX}.button`} />,
};

/**
 * This component breaks down copy implementation to avoid crowding views
 */
const NoPlanCard = ({ onStart, viewport }) => (
  <HomeCard
    title={COPY['title']}
    subtitle={COPY['body']}
    buttonText={COPY['button']}
    onClick={onStart}
    viewport={viewport}
  />
);

NoPlanCard.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default NoPlanCard;
