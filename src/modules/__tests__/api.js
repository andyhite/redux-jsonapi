import reducer, * as actions from '../api';
import serialize from '../../serialize';

describe('API module', () => {
  describe('Action Creators', () => {
    const resource = { type: 'widgets' };
    const params = { foo: 'bar' };
    const headers = { lorem: 'ipsum' };
    const meta = { auth: true };

    const methods = { 'get': 'GET', 'post': 'POST', 'put': 'PUT', 'patch': 'PATCH', 'del': 'DELETE' };

    Object.keys(methods).forEach((method) => {
      describe(method, () => {
        it(`creates an ${methods[method]} request`, () => {
          expect(actions[method](resource, { params, headers, meta })).toEqual({
            type: actions[methods[method]],
            payload: {
              params,
              headers,
              resource: serialize(resource),
            },
            meta,
          });
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
