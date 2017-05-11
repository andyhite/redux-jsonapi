import queryString from 'qs';
import { decamelize } from 'humps';
import * as apiActions from '../modules/api';

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
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }

  return response;
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
      const resourceAttributes = resource.attributes

      if (resourceAttributes && resourceAttributes.meta && resourceAttributes.meta.invocation) {
        urlParts = [...urlParts, '/', decamelize(resourceAttributes.meta.invocation)]
        delete resourceAttributes.meta
      } else if (resource.type){
        urlParts = [...urlParts, '/', decamelize(resource.type)]
      }

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

    response = handleErrors(response);
    response = response.status === 204 ? { resources } : handleResponse(response);

    return response;
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
