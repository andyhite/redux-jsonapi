import { camelize } from 'humps';

export const RECEIVE = '@@redux-jsonapi/RECEIVE';
export const GET = '@@redux-jsonapi/GET';
export const POST = '@@redux-jsonapi/POST';
export const PUT = '@@redux-jsonapi/PUT';
export const PATCH = '@@redux-jsonapi/PATCH';
export const DELETE = '@@redux-jsonapi/DELETE';

const request = (method, payload = {}, meta = {}) => {
  return {
    type: method,
    payload,
    meta,
  };
};

export const get = (resource, { meta, ...payload } = {}) => {
  return request(GET, { ...payload, resource }, meta);
};

export const post = (resource, { meta, ...payload } = {}) => {
  return request(POST, { ...payload, resource }, meta);
};

export const put = (resource, { meta, ...payload } = {}) => {
  return request(PUT, { ...payload, resource }, meta);
};

export const patch = (resource, { meta, ...payload } = {}) => {
  return request(PATCH, { ...payload, resource }, meta);
};

export const del = (resource, { meta, ...payload } = {}) => {
  return request(DELETE, { ...payload, resource }, meta);
};

export const receive = (resources) => {
  return {
    type: RECEIVE,
    payload: {
      resources,
    },
  };
};

function getInitialState() {
  return {};
}

function receiveReducer(state, { resources }) {
  return resources.reduce((nextState, resource) => {
    return {
      ...nextState,
      [camelize(resource.type)]: {
        ...nextState[camelize(resource.type)],
        [resource.id]: resource,
      },
    };
  }, state);
}

function reducer(state = getInitialState(), { type, payload }) {
  switch(type) {
    case RECEIVE:
      return receiveReducer(state, payload);
    default:
      return state;
  }
}

export default reducer;
