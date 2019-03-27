import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Text, Box, colors, Page } from '@catch/rio-ui-kit';

import Asset from './Asset';

const PREFIX = 'catch.module.retirement.PortfolioDetails';
export const COPY = {
  assetAllocation: <FormattedMessage id={`${PREFIX}.assetAllocation`} />,
};

const AssetList = ({ backgroundStyle, items }) => {
  const sortedItems = items && items.sort((a, b) => b.weight - a.weight);
  return (
    <Box w={1}>
      <Text weight="medium" mb={2}>
        {COPY['assetAllocation']}
      </Text>
      {sortedItems.map(item => (
        <Asset key={item.ticker} {...item} />
      ))}
    </Box>
  );
};

AssetList.propTypes = {
  backgroundStyle: PropTypes.object,
  items: PropTypes.array.isRequired,
};

export default AssetList;
