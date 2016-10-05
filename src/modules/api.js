import { camelize } from 'humps';
import { serialize } from '../serializers';

export const RECEIVE = '@@redux-jsonapi/RECEIVE';
export const GET = '@@redux-jsonapi/GET';
export const POST = '@@redux-jsonapi/POST';
export const PATCH = '@@redux-jsonapi/PATCH';
export const DELETE = '@@redux-jsonapi/DELETE';

const request = (method, resources, { meta = {}, ...payload }) => {
  return {
    type: method,
    payload: {
      ...payload,
      resources,
    },
    meta,
  };
};

const prepareResources = (resources) => {
  if (Array.isArray(resources)) return resources.map((resource) => serialize(resource));
  return [serialize(resources)];
};

const dataResource = (resources) => {
  resources = prepareResources(resources);
  return resources[resources.length - 1];
};

export const read = (resources, payload = {}) => {
  return request(GET, prepareResources(resources), payload);
};

export const write = (resources, payload = {}) => {
  return request(dataResource(resources).hasOwnProperty('id') ? PATCH : POST, prepareResources(resources), payload);
};

export const remove = (resources, payload = {}) => {
  return request(DELETE, prepareResources(resources), payload);
};

export const receive = (resources, method) => {
  return {
    type: RECEIVE,
    payload: {
      method,
      resources
    },
  };
};

function getInitialState() {
  return {};
}

function receiveReducer(state, { method, resources }) {
  return resources.reduce((nextState, resource) => {
    return {
      ...nextState,
      [camelize(resource.type)]: {
        ...nextState[camelize(resource.type)],
        [resource.id]: method === DELETE ? undefined : resource,
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
