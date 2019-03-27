import React from 'react';
import { FormattedMessage } from 'react-intl';

import { HeaderCard, Figure } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.home.PlanProcessingCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  body: <FormattedMessage id={`${PREFIX}.body`} />,
};

/**
 * This component breaks down copy implementation to avoid crowding views
 */
const PlanProcessingCard = props => (
  <HeaderCard title={COPY['title']} subtitle={COPY['body']} m={1}>
    <Figure name="PlanProcessing" />
  </HeaderCard>
);

export default PlanProcessingCard;
