import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { ReduxRadioGroup, Text } from '@catch/rio-ui-kit';

import { PortfolioOption } from '../components';
import { formName } from '../const';

export const PortfolioSelectionForm = ({
  recommendedPortfolio,
  portfolios,
  portfolioDetails,
  selectedPortfolio,
  isMobile,
  viewport,
  infoComponent,
}) => (
  <Field name="portfolioID" component={ReduxRadioGroup}>
    {portfolios.map((p, i) => (
      <PortfolioOption
        showDescriptionWhenToggled
        recommended={portfolios[i] === recommendedPortfolio}
        key={p.id}
        mb={2}
        value={p.id}
        label={p.name}
        isChecked={selectedPortfolio === p.id}
        subtitleCasing="uppercase"
        description={portfolioDetails[p.name].description}
        stocks={portfolioDetails[p.name].stocks}
        bonds={portfolioDetails[p.name].bonds}
        isMobile={isMobile}
        viewport={viewport}
        tooltip={infoComponent}
        {...p}
      />
    ))}
  </Field>
);

PortfolioSelectionForm.propTypes = {
  recommendedPortfolio: PropTypes.object.isRequired,
  portfolios: PropTypes.array.isRequired,
  portfolioDetails: PropTypes.object.isRequired,
  selectedPortfolio: PropTypes.string,
  isMobile: PropTypes.bool,
};

export default reduxForm({
  form: formName,
  destroyOnMount: false,
  enableReinitialize: true,
  forceUnregisterOnUnmount: true,
})(PortfolioSelectionForm);
