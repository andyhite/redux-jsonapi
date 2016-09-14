import reducer, * as actions from '../api';

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
            resource,
            params,
            headers,
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
            resource,
            params,
            headers,
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
            resource,
            params,
            headers,
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
            resource,
            params,
            headers,
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
            resource,
            params,
            headers,
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
