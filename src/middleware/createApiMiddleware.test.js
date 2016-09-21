import configureStore from 'redux-mock-store';
import createApiMiddleware from './createApiMiddleware';
import * as apiActions from '../modules/api';
import { serialize } from '../serializers';

const apiMiddleware = createApiMiddleware('http://example.com');
const middlewares = [apiMiddleware];
const mockStore = configureStore(middlewares);

describe('Middleware', () => {
  let store = null;
  let action = null;

  beforeEach(() => { store = mockStore({}) });
  afterEach(() => { fetchMock.restore() });

  describe('when the action is not a redux-jsonapi HTTP verb', () => {
    beforeEach(() => { action = { type: 'SOMETHING_UNRELATED' } });

    it('allows the action to continue along to the next middleware', async () => {
      await store.dispatch(action);
      expect(store.getActions()).toEqual([action]);
    });
  });

  describe('when the action is a redux-jsonapi HTTP verb', () => {
    beforeEach(() => { action = apiActions.read({ _type: 'articles' }) });

    describe('and the response is OK', () => {
      beforeEach(() => { fetchMock.get('http://example.com/articles', {}) });

      it('dispatches a RECEIVE action with the response data', async () => {
        await store.dispatch(action);
        expect(store.getActions()).toContain(action);
      });
    });

    describe('and the response is not OK', () => {
      beforeEach(() => { fetchMock.get('http://example.com/articles', 500) });

      it('throws the error', async () => {
        try {
          await store.dispatch(action);
        } catch(error) {
          expect(error).toEqual(new Error('Internal Server Error'));
        }
      });
    });
  });

  describe('when the action is a redux-jsonapi HTTP GET', () => {
    const response = {
      data: [
        { id: 1, type: 'articles', attributes: { title: 'Something about Redux' } },
        { id: 2, type: 'articles', attributes: { title: 'React blah blah blah' } },
      ],
      included: [
        { id: 1, type: 'authors', attributes: { firstName: 'Andrew', lastName: 'Hite' } },
      ],
    };

    beforeEach(() => { fetchMock.get('http://example.com/articles', response) });
    beforeEach(() => { action = apiActions.read({ _type: 'articles' }) });

    it('executes a GET request with the given payload', async () => {
      await store.dispatch(action);
      expect(fetchMock.lastUrl()).toEqual('http://example.com/articles');
      expect(fetchMock.lastOptions()).toEqual({
        method: 'GET',
        body: undefined,
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      })
    });
  });

  describe('when the action is a redux-jsonapi HTTP POST', () => {
    const article = { _type: 'articles', title: 'React blah blah blah' };

    const response = {
      data: { id: 2, ...serialize(article) },
    };

    beforeEach(() => { fetchMock.post('http://example.com/articles', response) });
    beforeEach(() => { action = apiActions.write(article) });

    it('executes a POST request with the given payload', async () => {
      await store.dispatch(action);
      expect(fetchMock.lastUrl()).toEqual('http://example.com/articles');
      expect(fetchMock.lastOptions()).toEqual({
        method: 'POST',
        body: JSON.stringify({
          data: serialize(article),
        }),
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      })
    });
  });

  describe('when the action is a redux-jsonapi HTTP PATCH', () => {
    const article = { _type: 'articles', id: 2, title: 'React blah blah blah' };

    const response = {
      data: serialize(article),
    };

    beforeEach(() => { fetchMock.patch('http://example.com/articles/2', response) });
    beforeEach(() => { action = apiActions.write(article) });

    it('executes a PATCH request with the given payload', async () => {
      await store.dispatch(action);
      expect(fetchMock.lastUrl()).toEqual('http://example.com/articles/2');
      expect(fetchMock.lastOptions()).toEqual({
        method: 'PATCH',
        body: JSON.stringify({
          data: serialize(article),
        }),
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      })
    });
  });

  describe('when the action is a redux-jsonapi HTTP DELETE', () => {
    const article = { _type: 'articles', id: 2, title: 'React blah blah blah' };

    const response = {
      data: null,
    };

    beforeEach(() => { fetchMock.delete('http://example.com/articles/2', response) });
    beforeEach(() => { action = apiActions.remove(article) });

    it('executes a DELETE request with the given payload', async () => {
      await store.dispatch(action);
      expect(fetchMock.lastUrl()).toEqual('http://example.com/articles/2');
      expect(fetchMock.lastOptions()).toEqual({
        method: 'DELETE',
        body: JSON.stringify({
          data: serialize(article),
        }),
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      })
    });
  });
});
