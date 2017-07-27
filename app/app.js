import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { navigate } from 'redux-routing';
import { store, client } from './redux/config';
import routes from './routes';
import { Router } from './components/shared';

store.dispatch(navigate(window.location.href));

ReactDOM.render((
  <ApolloProvider client={client} store={store}>
    <Router routes={routes} />
  </ApolloProvider>
), document.getElementById('root'));
