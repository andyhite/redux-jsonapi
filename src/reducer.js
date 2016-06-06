import Immutable from 'immutable';
import * as actionTypes from './actionTypes';

function loadingResource(state, resource) {
  return state.setIn(['meta', resource.type, 'isLoading'], true);
}

function loadResource(state, resource) {
  if (Immutable.List.isList(resource)) {
    return resource.reduce(loadResource, state);
  }

  return state.
    setIn(['resources', resource.get('type'), resource.get('id')], resource).
    setIn(['meta', resource.get('type'), 'isLoading'], false);
}

function unloadResource(state, resource) {
  if (Immutable.List.isList(resource)) {
    return resource.reduce(unloadResource, state);
  }

  return state.
    deleteIn(['resources', resource.get('type'), resource.get('id')]).
    setIn(['meta', resource.get('type'), 'isLoading'], false);
}

export default function resourceReducer(state = new Immutable.Map, action) {
  switch (action.type) {
    case actionTypes.LOADING:
      return loadingResource(state, Immutable.fromJS(action.data));
    case actionTypes.LOAD:
      return loadResource(state, Immutable.fromJS(action.data));
    case actionTypes.UNLOAD:
      return unloadResource(state, Immutable.fromJS(action.data));
    default:
      return state;
  }
}
