import configureStore from 'redux-mock-store';
import reducer, * as actions from './api';
import thunk from 'redux-thunk';
import { serialize } from '../serializers';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('API module', () => {
  describe('Action Creators', () => {
    let store;
    let resource;
    let payload;
    let initialState;

    beforeEach(() => { resource = { _type: 'widgets' } });

    beforeEach(() => { payload = {
      params: { page: 1 },
      headers: { 'Authorization': 'Token token=123' },
      meta: { auth: true },
    }});

    beforeEach(() => { initialState = {
      api: {}
    }});

    beforeEach(() => { store = mockStore(initialState) });
    afterEach(() => { fetchMock.restore() });

    describe('write', () => {
      describe('when the resource does not have an ID', () => {
        it('creates a POST request', () => {
          expect(actions.write(resource, payload)).toEqual({
            type: actions.POST,
            payload: {
              params: payload.params,
              headers: payload.headers,
              resources: [serialize(resource)],
            },
            meta: payload.meta,
          });
        });
      });

      describe('when the resource has an ID', () => {
        beforeEach(() => { resource = { ...resource, id: 1 } });

        it('creates a PATCH request', () => {
          expect(actions.write(resource, payload)).toEqual({
            type: actions.PATCH,
            payload: {
              params: payload.params,
              headers: payload.headers,
              resources: [serialize(resource)],
            },
            meta: payload.meta,
          });
        });
      });
    });

    describe('read', () => {
      it('creates a GET request', () => {
        expect(actions.read(resource, payload)).toEqual({
          type: actions.GET,
          payload: {
            params: payload.params,
            headers: payload.headers,
            resources: [serialize(resource)],
          },
          meta: payload.meta,
        });
      });
    });

    describe('remove', () => {
      it('creates a DELETE request', () => {
        expect(actions.remove(resource, payload)).toEqual({
          type: actions.DELETE,
          payload: {
            params: payload.params,
            headers: payload.headers,
            resources: [serialize(resource)],
          },
          meta: payload.meta,
        });
      });
    });

    describe('receive', () => {
      it('creates a RECEIVE action', () => {
        expect(actions.receive([resource])).toEqual({
          type: actions.RECEIVE,
          payload: {
            resources: [resource],
          },
        });
      });
    });

    describe('fetchRelationships', () => {
      beforeEach(() => {
        resource = {
          ...resource,
          id: '1',
          foo: () => ({ id: 1, _type: 'foos', _meta: { loaded: false} }),
        };
      })

      beforeEach(() => {
        initialState = {
          api: {
            [resource._type]: {
              [resource.id]: resource,
            },
          },
        };
      });

      beforeEach(() => { store = mockStore(initialState) });

      it('makes requests to load any currently un-loaded relationships', async () => {
        await store.dispatch(actions.fetchRelationships(resource));
        expect(store.getActions()).toEqual([actions.read(resource.foo())]);
      });
    });
  });

  describe('Reducer', () => {
    it('returns the initial state', () => {
      expect(reducer(undefined, {})).toEqual({});
    });

    describe('handles RECEIVE', () => {
      it('by adding resources to their buckets', () => {
        const resources = [{
          id: 1,
          type: 'widgets',
          attributes: {
            name: 'Widget #1',
          },
        }, {
          id: 1,
          type: 'gadgets',
          attributes: {
            name: 'Gadget #1',
          },
        }];

        expect(reducer(undefined, actions.receive(resources))).toEqual({
          widgets: {
            1: resources[0],
          },
          gadgets: {
            1: resources[1],
          },
        });
      });
    });
  });
});
