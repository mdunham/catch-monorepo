import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import Login, { withAuthSaga } from '@catch/login';

import DisclosuresView from '@catch/disclosures';

// Debug
import StoreDisplay from 'web/components/StoreDisplay';

// Modules
import AuthenticatedRoute from 'web/modules/AuthenticatedRoute';
import { ToastContainer } from '@catch/errors';

// Views
import NotFoundView from 'web/views/NotFoundView/Async';
import AuthenticatedView from 'web/views/AuthenticatedView';

// Layouts
import FullPage from 'web/layouts/FullPage';
import NavBar from 'web/components/NavBar';

class App extends Component {
  render() {
    return (
      <FullPage id="app-container">
        <Helmet titleTemplate="Catch | %s" defaultTitle="Catch">
          <meta name="description" content="A portable benefits platform" />
        </Helmet>
        <Route path="" component={NavBar} />

        <Switch>
          <Route path="/auth" component={Login} />
          <Route path="/disclosures" component={DisclosuresView} />
          <AuthenticatedRoute path="" component={AuthenticatedView} />
          <Route component={NotFoundView} />
        </Switch>

        <ToastContainer />

        {/* Useful Redux store displayer while in development (in case I'm lazy and don't have devtools up).
            Will be removed once MVP is ready to go */}
        <StoreDisplay />
      </FullPage>
    );
  }
}

export default withAuthSaga(App);
