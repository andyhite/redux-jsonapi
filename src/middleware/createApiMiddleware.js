import queryString from 'qs';
import { decamelize } from 'humps';
import * as apiActions from '../modules/api';
import fetch from 'isomorphic-fetch'


function getDefaultHeaders() {
  return {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  };
}

function serialize(resource) {
  return JSON.stringify(resource);
}

function handleErrors(response) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

async function handleResponse(response) {
  const { data, included = [], meta = {} } = await response.json();

  if (data) {
    return {
      resources: [...(Array.isArray(data) ? data : [data]), ...included],
      result: Array.isArray(data) ? data.map((r) => r.id) : data.id,
      meta,
    };
  }

  return {
    resources: [],
    result: null,
    meta
  };
}

function createMiddleware(host, defaultHeaders) {
  const getURL = (resources, params, options = {}) => {
    let urlParts = [host];

    resources.forEach((resource) => {
      if (resource.type) urlParts = [...urlParts, '/', decamelize(resource.type)];
      if (resource.id) urlParts = [...urlParts, '/', resource.id];
    });

    if (params) urlParts = [...urlParts, '?', queryString.stringify(params)];

    if (options.formatURL) return options.formatURL(urlParts.join(''));
    return urlParts.join('');
  };

  const requestAction = async (method, { resources, params, headers, options } = {}) => {
    const url = getURL(resources, params, options);

    let response = await fetch(url, {
      method,
      body: ['POST', 'PATCH'].includes(method) ? serialize({ data: resources[resources.length - 1] }) : undefined,
      headers: {
        ...getDefaultHeaders(),
        ...defaultHeaders,
        ...headers,
      },
    });

    if (response.ok) {
      if (response.status === 204) {
        return {resources};
      }
      return handleResponse(response);
    }
    handleErrors(response);

  };

  const requestActions = {
    [apiActions.GET]: (options) => requestAction('GET', options),
    [apiActions.POST]: (options) => requestAction('POST', options),
    [apiActions.PATCH]: (options) => requestAction('PATCH', options),
    [apiActions.DELETE]: (options) => requestAction('DELETE', options),
  };

  return (store) => (next) => async (action) => {
    if (requestActions.hasOwnProperty(action.type)) {
      next(action);

      const data = await requestActions[action.type](action.payload);
      store.dispatch(apiActions.receive(data.resources, action.type));
      return data;
    }

    return next(action);
  };
}

export default createMiddleware;
