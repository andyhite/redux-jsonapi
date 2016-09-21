import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { apiReducer, createApiMiddleware } from 'redux-jsonapi';
import App from './components/App';
import appReducer from './modules/app';

const rootReducer = combineReducers({
  api: apiReducer,
  app: appReducer,
});

// This would typically be your application's API host. In this example, we're using a GitHub Gist so we include the entire path before our file's name.
const apiMiddleware = createApiMiddleware('https://dl.dropboxusercontent.com/s/73l5t8u23gta7gi');

const middlewares = [
  apiMiddleware,
  thunkMiddleware,
];

const enhancer = compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
);

const store = createStore(rootReducer, {}, enhancer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
