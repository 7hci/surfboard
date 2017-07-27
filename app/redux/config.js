import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { History, createMiddleware, reducer as router } from 'redux-routing';
import { combineForms as combine } from 'react-redux-form';
import { ApolloClient } from 'react-apollo';
import { createNetworkInterface } from 'apollo-upload-client';
import reducers from './reducers';

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin'
  }
});
const apolloClient = new ApolloClient({ networkInterface });
const apollo = apolloClient.reducer();
const message = 'Please click the link below to complete and sign the Master Subcontractor Service '
  + 'Agreement. If you have any questions or concerns, please let me know.';
const form = combine({ info: {}, contractAdmin: { message }, contractClient: {}, onboarding: {}, none: {} }, 'form');
const rootReducer = combineReducers(Object.assign({ router, apollo, form }, reducers));
const routeMiddleware = createMiddleware(History);
export const store = createStore(rootReducer, applyMiddleware(thunk, routeMiddleware, apolloClient.middleware()));
export const client = apolloClient;
