import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { History, createMiddleware, navigate, reducer as router } from 'redux-routing';
import { combineForms } from 'react-redux-form';

import routes from './routes';
import * as reducers from './redux/reducers';
import { Router } from './components/shared';

const message = 'Please click the link below to complete and sign the Master Subcontractor Service '
  + 'Agreement. If you have any questions or concerns, please let me know.';
const form = combineForms({
  info: {}, contractAdmin: { message }, contractClient: {}, onboarding: {}, none: {}
}, 'form');

const rootReducer = combineReducers(Object.assign({ router, form }, reducers));
const routingMiddleware = createMiddleware(History);
// const store = createStore(rootReducer, applyMiddleware(thunk, routingMiddleware));
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, routingMiddleware)));

store.dispatch(navigate(window.location.href));

ReactDOM.render((
  <Provider store={store}>
    <Router routes={routes} />
  </Provider>
), document.getElementById('root'));
