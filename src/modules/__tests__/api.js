import reducer, * as actions from '../api';
import serialize from '../../serialize';

describe('API module', () => {
  describe('Action Creators', () => {
    const resource = { type: 'widgets' };
    const params = { foo: 'bar' };
    const headers = { lorem: 'ipsum' };
    const meta = { auth: true };

    describe('get', () => {
      it('creates an GET request', () => {
        expect(actions.get(resource, { params, headers, meta })).toEqual({
          type: actions.GET,
          payload: {
            params,
            headers,
            resource: serialize(resource),
          },
          meta,
        });
      });
    });

    describe('post', () => {
      it('creates a POST request', () => {
        expect(actions.post(resource, { params, headers, meta })).toEqual({
          type: actions.POST,
          payload: {
            params,
            headers,
            resource: serialize(resource),
          },
          meta,
        });
      });
    });

    describe('put', () => {
      it('creates a PUT request', () => {
        expect(actions.put(resource, { params, headers, meta })).toEqual({
          type: actions.PUT,
          payload: {
            params,
            headers,
            resource: serialize(resource),
          },
          meta,
        });
      });
    });

    describe('patch', () => {
      it('creates a PATCH request', () => {
        expect(actions.patch(resource, { params, headers, meta })).toEqual({
          type: actions.PATCH,
          payload: {
            params,
            headers,
            resource: serialize(resource),
          },
          meta,
        });
      });
    });

    describe('del', () => {
      it('creates a DELETE request', () => {
        expect(actions.del(resource, { params, headers, meta })).toEqual({
          type: actions.DELETE,
          payload: {
            params,
            headers,
            resource: serialize(resource),
          },
          meta,
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
