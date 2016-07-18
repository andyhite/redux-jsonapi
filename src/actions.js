import Immutable from 'immutable';
import uuid from 'node-uuid';
import * as actionTypes from './actionTypes';
import * as api from './api';
import reduxJsonApi from './reduxJsonApi';

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

function deserializeResponse(data, state) {
  if (Array.isArray(data)) {
    return api.deserializeResources(data, state);
  }

  return api.deserializeResource(data, state);
}

function serializeData(data) {
  if (data) {
    if (Array.isArray(data)) {
      return data.map((resource) => {
        if (resource._type) {
          return api.serializeResource(resource);
        }

        return resource;
      });
    }

    if (data._type) {
      return api.serializeResource(data);
    }
  }

  return data;
}

export function load(data, included) {
  return (dispatch) => {
    const serializedData = serializeData(data);

    dispatch({
      type: actionTypes.LOAD,
      data: [
        ...(Array.isArray(serializedData) ? serializedData : [serializedData]),
        ...(serializeData(included) || []),
      ],
    });

    return serializedData;
  };
}

export function unload(data) {
  return (dispatch) => {
    const serializedData = serializeData(data);

    dispatch({
      type: actionTypes.UNLOAD,
      data: serializedData,
    });

    return null;
  };
}

export function build(data) {
  return (dispatch) => {
    const serializedData = serializeData(data);

    dispatch(
      load({
        ...serializedData,
        attributes: { ...serializedData.attributes },
        relationships: { ...serializedData.relationships },
        meta: { uuid: uuid.v4() },
      })
    );
  };
}

export function create(resource, { query, ...otherOptions } = {}) {
  return (dispatch, getState) => {
    const serializedResource = serializeData(resource);

    dispatch({ type: actionTypes.LOADING, data: serializedResource });

    return fetch(resourceURL(serializedResource, query), {
      ...otherOptions,
      method: 'POST',
      body: JSON.stringify({ data: serializedResource }),
      headers: reduxJsonApi.config.processHeaders({
        ...otherOptions.headers,
        'Accept': 'application/json', // eslint-disable-line quote-props
        'Content-Type': 'application/json',
      }, getState),
    }).then((response) => handleResponse(response))
    .then((body) => dispatch(load(body.data, body.included)))
    .then((data) => deserializeResponse(data, getState().api));
  };
}

export function read(resource, { query, ...otherOptions } = {}) {
  return (dispatch, getState) => {
    const serializedResource = serializeData(resource);

    dispatch({ type: actionTypes.LOADING, data: serializedResource });

    return fetch(resourceURL(serializedResource, query), {
      ...otherOptions,
      method: 'GET',
      headers: reduxJsonApi.config.processHeaders({
        ...otherOptions.headers,
        'Accept': 'application/json', // eslint-disable-line quote-props
        'Content-Type': 'application/json',
      }, getState),
    }).then((response) => handleResponse(response))
    .then((body) => dispatch(load(body.data, body.included)))
    .then((data) => deserializeResponse(data, getState().api));
  };
}

export function update(resource, { query, ...otherOptions } = {}) {
  return (dispatch, getState) => {
    const serializedResource = serializeData(resource);

    dispatch({ type: actionTypes.LOADING, data: serializedResource });

    return fetch(resourceURL(serializedResource, query), {
      ...otherOptions,
      method: 'PATCH',
      body: JSON.stringify({ data: serializedResource }),
      headers: reduxJsonApi.config.processHeaders({
        ...otherOptions.headers,
        'Accept': 'application/json', // eslint-disable-line quote-props
        'Content-Type': 'application/json',
      }, getState),
    }).then((response) => handleResponse(response))
    .then((body) => dispatch(load(body.data, body.included)))
    .then((data) => deserializeResponse(data, getState().api));
  };
}

export function destroy(resource, { query, ...otherOptions } = {}) {
  return (dispatch, getState) => {
    const serializedResource = serializeData(resource);

    dispatch({ type: actionTypes.LOADING, data: serializedResource });

    return fetch(resourceURL(serializedResource, query), {
      ...otherOptions,
      method: 'DELETE',
      headers: reduxJsonApi.config.processHeaders({
        ...otherOptions.headers,
        'Accept': 'application/json', // eslint-disable-line quote-props
        'Content-Type': 'application/json',
      }, getState),
    }).then((response) => handleResponse(response))
    .then(() => dispatch(unload({ data: serializedResource })))
    .then(() => null);
  };
}
