export const RECEIVE = '@@redux-jsonapi/RECEIVE';
export const GET = '@@redux-jsonapi/GET';
export const POST = '@@redux-jsonapi/POST';
export const PUT = '@@redux-jsonapi/PUT';
export const PATCH = '@@redux-jsonapi/PATCH';
export const DELETE = '@@redux-jsonapi/DELETE';

export const request = (method, payload = {}) => {
  return {
    type: method,
    payload,
  },
};

export const get = (resource, params = {}, headers = {}) => {
  return request(GET, { resource, params, headers });
};

export const post = (resource, params = {}, headers = {}) => {
  return request(POST, { resource, params, headers });
};

export const put = (resource, params = {}, headers = {}) => {
  return request(PUT, { resource, params, headers });
};

export const patch = (resource, params = {}, headers = {}) => {
  return request(PATCH, { resource, params, headers });
};

export const del = (resource, params = {}, headers = {}) => {
  return request(DELETE, { resource, params, headers });
};

export const receive = (resources) => {
  return {
    type: RECEIVE,
    payload: {
      resources,
    },
  };
};

const createReducer = () => {
  function getInitialState() {
    return {};
  }

  function receiveReducer(state, { resources }) {
    return resources.reduce((nextState, entity) => {
      return {
        ...nextState,
        [entity.type]: {
          ...nextState[entity.type],
          [entity.id]: entity,
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
};

export default createReducer;
