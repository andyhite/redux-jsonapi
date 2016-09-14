import queryString from 'qs';
import { decamelize } from 'humps';
import * as apiActions from '../modules/api';

function getDefaultHeaders() {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
}

function serialize(resource) {
  return JSON.stringify(resource);
}

function handleErrors(response) {
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }

  return response;
}

function handleResponse(response) {
  return response.json().then(({ data, included, meta }) => {
    return {
      resources: [data, ...included],
      result: Array.isArray(data) ? data.map((r) => r.id) : data.id,
      meta,
    };
  });
}

function createMiddleware(host, defaultHeaders = getDefaultHeaders()) {
  const getURL = (resource, params) => {
    let urlParts = [host];

    if (resource.type) urlParts = [...urlParts, '/', decamelize(resource.type)];
    if (resource.id) urlParts = [...urlParts, '/', resource.id];
    if (params) urlParts = [...urlParts, '?', queryString.stringify(params)];

    return urlParts.join('');
  };

  const requestAction = (method, { resource, params, headers }) => {
    const url = getURL(resource, params);

    return fetch(url, {
      method,
      body: method !== 'GET' ? serialize(resource) : undefined,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    }).then((response) => (
      handleErrors(response)
    )).then((response) => (
      handleResponse(response)
    ));
  };

  const requestActions = {
    [apiActions.GET]: (options) => requestAction('GET', options),
    [apiActions.POST]: (options) => requestAction('POST', options),
    [apiActions.PUT]: (options) => requestAction('PUT', options),
    [apiActions.PATCH]: (options) => requestAction('PATCH', options),
    [apiActions.DELETE]: (options) => requestAction('DELETE', options),
  };

  return (store) => (next) => (action) => {
    if (requestActions[action.type]) {
      next(action);

      return requestActions[action.type](action.payload).then((data) => {
        store.dispatch(apiActions.receive(data.resources));
        return result;
      });
    }

    return next(action);
  };
}

export default createMiddleware;
