import Immutable from 'immutable';
import * as actionTypes from './actionTypes';
import * as api from './api';

function RequestError(response, errors = new Immutable.List) {
  this.name = 'RequestError';
  this.status = response.status;
  this.errors = errors;
}

function ServerError(response, errors = new Immutable.List) {
  this.name = 'ServerError';
  this.status = response.status;
  this.errors = errors;
}

function resourceURL(resource, query) {
  const parts = [`${window.API_HOST}`];

  if (resource.type) parts.push(`/${resource.type}`);
  if (resource.id) parts.push(`/${resource.id}`);
  if (query) parts.push(`?${objectToQueryString(query)}`);

  return parts.join('');
}

function objectToQueryString(object) {
  const parts = [];

  for (const i in object) {
    if (object.hasOwnProperty(i)) {
      parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(object[i])}`);
    }
  }

  return parts.join('&');
}

function handleResponse(response) {
  return response.json().then((body) => {
    if (response.status > 400 && response.status <= 499) {
      throw new RequestError(response, Immutable.fromJS(body.errors));
    }

    if (response.status > 500 && response.status <= 599) {
      throw new ServerError(response, Immutable.fromJS(body.errors));
    }

    return body;
  });
}

function handleLoad(dispatch, body) {
  dispatch({
    type: actionTypes.LOAD,
    data: [
      ...(Array.isArray(body.data) ? body.data : [body.data]),
      ...(body.included || []),
    ],
  });

  return body;
}

function handleUnload(dispatch, body) {
  dispatch({
    type: actionTypes.UNLOAD,
    data: body,
  });

  return null;
}

function deserializeResponse(body, state) {
  if (Array.isArray(body.data)) {
    return api.deserializeResources(body.data, state);
  }

  return api.deserializeResource(body.data, state);
}

export function create(resource, { query, ...otherOptions } = {}) {
  return (dispatch, getState) => {
    dispatch({ type: actionTypes.LOADING, data: resource });

    return fetch(resourceURL(resource, query), {
      ...otherOptions,
      method: 'POST',
      body: JSON.stringify({ data: resource }),
      headers: {
        ...otherOptions.headers,
        'Accept': 'application/json', // eslint-disable-line quote-props
        'Content-Type': 'application/json',
      },
    }).then((response) => handleResponse(response))
    .then((body) => handleLoad(dispatch, body))
    .then((body) => deserializeResponse(body, getState().api));
  };
}

export function read(resource, { query, ...otherOptions } = {}) {
  return (dispatch, getState) => {
    dispatch({ type: actionTypes.LOADING, data: resource });

    return fetch(resourceURL(resource, query), {
      ...otherOptions,
      method: 'GET',
      headers: {
        ...otherOptions.headers,
        'Accept': 'application/json', // eslint-disable-line quote-props
        'Content-Type': 'application/json',
      },
    }).then((response) => handleResponse(response))
    .then((body) => handleLoad(dispatch, body))
    .then((body) => deserializeResponse(body, getState().api));
  };
}

export function update(resource, { query, ...otherOptions } = {}) {
  return (dispatch, getState) => {
    dispatch({ type: actionTypes.LOADING, data: resource });

    return fetch(resourceURL(resource, query), {
      ...otherOptions,
      method: 'PATCH',
      body: JSON.stringify({ data: resource }),
      headers: {
        ...otherOptions.headers,
        'Accept': 'application/json', // eslint-disable-line quote-props
        'Content-Type': 'application/json',
      },
    }).then((response) => handleResponse(response))
    .then((body) => handleLoad(dispatch, body))
    .then((body) => deserializeResponse(body, getState().api));
  };
}

export function destroy(resource, { query, ...otherOptions } = {}) {
  return (dispatch) => {
    dispatch({ type: actionTypes.LOADING, data: resource });

    return fetch(resourceURL(resource, query), {
      ...otherOptions,
      method: 'DELETE',
      headers: {
        ...otherOptions.headers,
        'Accept': 'application/json', // eslint-disable-line quote-props
        'Content-Type': 'application/json',
      },
    }).then((response) => handleResponse(response))
    .then(() => handleUnload(dispatch, { data: resource }))
    .then(() => null);
  };
}
