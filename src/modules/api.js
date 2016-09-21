import { camelize } from 'humps';
import { serialize } from '../serializers';

export const RECEIVE = '@@redux-jsonapi/RECEIVE';
export const GET = '@@redux-jsonapi/GET';
export const POST = '@@redux-jsonapi/POST';
export const PATCH = '@@redux-jsonapi/PATCH';
export const DELETE = '@@redux-jsonapi/DELETE';

const request = (method, resource, { meta, ...payload }) => {
  return {
    type: method,
    payload: {
      ...payload,
      resource,
    },
    meta,
  };
};

export const read = (resource, payload = {}) => {
  return request(GET, serialize(resource), payload);
};

export const write = (resource, payload = {}) => {
  return request(resource.hasOwnProperty('id') ? PATCH : POST, serialize(resource), payload);
};

export const remove = (resource, payload = {}) => {
  return request(DELETE, serialize(resource), payload);
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
