import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'react-router-redux';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';

// Internal Modules
import { LanguageProvider } from '@catch/utils';
import { ResponsiveProvider } from '@catch/rio-ui-kit';
import App from 'web/modules/App';
// import client from 'apollo/client';

// Global CSS
import 'web/index.css';

/**
 * AppProvider is our top level component that aggregates all necessary external
 * context providers and renders our App.  It is also in charge of setting up
 * any global style context that might be needed in various libraries.
 */
class AppProvider extends Component {
  static propTypes = {
    // Our enhanced redux store that can do code splitting injection
    store: PropTypes.object.isRequired,
    // Our i18n messages
    messages: PropTypes.object.isRequired,
    // Browser history to use in routing
    history: PropTypes.object.isRequired,
  };

  render() {
    const { store, client, messages, history } = this.props;
    return (
      <ResponsiveProvider>
        <ReduxProvider store={store}>
          <LanguageProvider messages={messages}>
            <ConnectedRouter history={history}>
              <ApolloProvider client={client}>
                <App />
              </ApolloProvider>
            </ConnectedRouter>
          </LanguageProvider>
        </ReduxProvider>
      </ResponsiveProvider>
    );
  }
}

export default AppProvider;
