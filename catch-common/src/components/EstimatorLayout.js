import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Box, H1, H3, Spinner, SplitLayout } from '@catch/rio-ui-kit';

import ResultCard from './ResultCard';
import SmallPageTitle from './SmallPageTitle';

class EstimatorLayout extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    loading: PropTypes.bool,
    form: PropTypes.node,
    result: PropTypes.node,
    percent: PropTypes.number,
    /* From hoc responsive */
    viewport: PropTypes.string,
    // monthlyPayment:PropTypes.num, not sure.
  };
  render() {
    const {
      title,
      subtitle,
      loading,
      form,
      result,
      percent,
      viewport,
      monthlyPayment,
    } = this.props;

    return (
      <Box>
        {loading ? (
          <Spinner />
        ) : (
          <SplitLayout>
            <Box>
              <SmallPageTitle title={title} subtitle={subtitle} />
              {form}
            </Box>
            <ResultCard percent={percent} monthlyPayment={monthlyPayment}>
              {result}
            </ResultCard>
          </SplitLayout>
        )}
      </Box>
    );
  }
}

export default EstimatorLayout;
