import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import DisclosureContainer from './DisclosureContainer';
import DisclosuresView from './DisclosuresView';

const Navigation = ({ match: { path } }) => (
  <Switch>
    <Route path={`${path}/:disclosure`} component={DisclosureContainer} />
    <Route path={`${path}`} component={DisclosuresView} />
  </Switch>
);

Navigation.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Navigation;
