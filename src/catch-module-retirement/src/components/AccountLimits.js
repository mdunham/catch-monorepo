import React from 'react';
import PropTypes from 'prop-types';

import { Bullet, Link, Text } from '@catch/rio-ui-kit';

import { accountTypes } from '../utils';

const HELP_LINKS = {
  IRA:
    'http://help.catch.co/building-for-retirement/am-i-eligible-for-a-traditional-ira',
  ROTH_IRA:
    'https://help.catch.co/building-for-retirement/am-i-eligible-for-a-roth-ira',
};

const HELP_ARTICLE = accountType => (
  <Link to={HELP_LINKS[accountType]} newTab>
    Help article
  </Link>
);

const MGAI_LINK = (
  <Link
    to="https://help.catch.co/building-for-retirement/what-is-modified-adjusted-gross-income"
    newTab
  >
    Modified Gross Adjusted Income
  </Link>
);

const RothLimits = () => (
  <React.Fragment>
    <Bullet>{accountTypes['ROTH_IRA'].limit1}</Bullet>
    <Bullet>{accountTypes['ROTH_IRA'].limit2}</Bullet>
    <Bullet>{accountTypes['ROTH_IRA'].limit3}</Bullet>
    <Bullet>{accountTypes['ROTH_IRA'].limit4}</Bullet>
    <Bullet>
      {accountTypes['ROTH_IRA'].limit5({
        link: MGAI_LINK,
      })}
    </Bullet>
    <Bullet>
      {accountTypes['ROTH_IRA'].limit6({
        link: MGAI_LINK,
      })}
    </Bullet>
    <Bullet>{accountTypes['ROTH_IRA'].limit7}</Bullet>
    <Bullet>
      {accountTypes['ROTH_IRA'].limit8({ link: HELP_ARTICLE('ROTH_IRA') })}
    </Bullet>
  </React.Fragment>
);

const TraditionalLimits = () => (
  <React.Fragment>
    <Bullet>{accountTypes['IRA'].limit1}</Bullet>
    <Bullet>{accountTypes['IRA'].limit2}</Bullet>
    <Bullet>{accountTypes['IRA'].limit3}</Bullet>
    <Bullet>{accountTypes['IRA'].limit4}</Bullet>
    <Bullet>{accountTypes['IRA'].limit5}</Bullet>
    <Bullet>{accountTypes['IRA'].limit6}</Bullet>
    <Bullet>{accountTypes['IRA'].limit7({ link: HELP_ARTICLE('IRA') })}</Bullet>
  </React.Fragment>
);

const MAP = {
  ROTH_IRA: RothLimits,
  IRA: TraditionalLimits,
};

const GUIDE_TEXT = {
  ROTH_IRA: 'Roth IRA',
  IRA: 'Traditional IRA',
};

const AccountLimits = ({ selectedAccountType }) => {
  const Component = MAP[selectedAccountType];
  return (
    <React.Fragment>
      <Text mt={2} size="small">{`Only you can decide if a ${
        GUIDE_TEXT[selectedAccountType]
      } is right for you. Here are some details worth considering:`}</Text>
      <Component />
    </React.Fragment>
  );
};

AccountLimits.propTypes = {
  selectedAccountType: PropTypes.string.isRequired,
};

export default AccountLimits;
