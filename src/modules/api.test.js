import reducer, * as actions from './api';
import { serialize } from '../serializers';

describe('API module', () => {
  describe('Action Creators', () => {
    let resource = { _type: 'widgets' };
    let payload = {
      params: { page: 1 },
      headers: { 'Authorization': 'Token token=123' },
      meta: { auth: true },
    };


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
