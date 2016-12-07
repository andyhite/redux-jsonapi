'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _reduxMockStore = require('redux-mock-store');

var _reduxMockStore2 = _interopRequireDefault(_reduxMockStore);

var _api2 = require('./api');

var actions = _interopRequireWildcard(_api2);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _serializers = require('../serializers');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middlewares = [_reduxThunk2.default];
var mockStore = (0, _reduxMockStore2.default)(middlewares);

describe('API module', function () {
  describe('Action Creators', function () {
    var store = void 0;
    var resource = void 0;
    var payload = void 0;
    var initialState = void 0;

    beforeEach(function () {
      resource = { _type: 'widgets' };
    });

    beforeEach(function () {
      payload = {
        params: { page: 1 },
        headers: { 'Authorization': 'Token token=123' },
        meta: { auth: true }
      };
    });

    beforeEach(function () {
      initialState = {
        api: {}
      };
    });

    beforeEach(function () {
      store = mockStore(initialState);
    });
    afterEach(function () {
      fetchMock.restore();
    });

    describe('write', function () {
      describe('when the resource does not have an ID', function () {
        it('creates a POST request', function () {
          expect(actions.write(resource, payload)).toEqual({
            type: actions.POST,
            payload: {
              params: payload.params,
              headers: payload.headers,
              resources: [(0, _serializers.serialize)(resource)]
            },
            meta: payload.meta
          });
        });
      });

      describe('when the resource has an ID', function () {
        beforeEach(function () {
          resource = (0, _extends3.default)({}, resource, { id: 1 });
        });

        it('creates a PATCH request', function () {
          expect(actions.write(resource, payload)).toEqual({
            type: actions.PATCH,
            payload: {
              params: payload.params,
              headers: payload.headers,
              resources: [(0, _serializers.serialize)(resource)]
            },
            meta: payload.meta
          });
        });
      });
    });

    describe('read', function () {
      it('creates a GET request', function () {
        expect(actions.read(resource, payload)).toEqual({
          type: actions.GET,
          payload: {
            params: payload.params,
            headers: payload.headers,
            resources: [(0, _serializers.serialize)(resource)]
          },
          meta: payload.meta
        });
      });
    });

    describe('remove', function () {
      it('creates a DELETE request', function () {
        expect(actions.remove(resource, payload)).toEqual({
          type: actions.DELETE,
          payload: {
            params: payload.params,
            headers: payload.headers,
            resources: [(0, _serializers.serialize)(resource)]
          },
          meta: payload.meta
        });
      });
    });

    describe('receive', function () {
      it('creates a RECEIVE action', function () {
        expect(actions.receive([resource])).toEqual({
          type: actions.RECEIVE,
          payload: {
            resources: [resource]
          }
        });
      });
    });

    describe('fetchRelationships', function () {
      beforeEach(function () {
        resource = (0, _extends3.default)({}, resource, {
          id: '1',
          foo: function foo() {
            return { id: 1, _type: 'foos', _meta: { loaded: false } };
          }
        });
      });

      beforeEach(function () {
        initialState = {
          api: (0, _defineProperty3.default)({}, resource._type, (0, _defineProperty3.default)({}, resource.id, resource))
        };
      });

      beforeEach(function () {
        store = mockStore(initialState);
      });

      it('makes requests to load any currently un-loaded relationships', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return store.dispatch(actions.fetchRelationships(resource));

              case 2:
                expect(store.getActions()).toEqual([actions.read(resource.foo())]);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      })));
    });
  });

  describe('Reducer', function () {
    it('returns the initial state', function () {
      expect((0, actions.default)(undefined, {})).toEqual({});
    });

    describe('handles RECEIVE', function () {
      it('by adding resources to their buckets', function () {
        var resources = [{
          id: 1,
          type: 'widgets',
          attributes: {
            name: 'Widget #1'
          }
        }, {
          id: 1,
          type: 'gadgets',
          attributes: {
            name: 'Gadget #1'
          }
        }];

        expect((0, actions.default)(undefined, actions.receive(resources))).toEqual({
          widgets: {
            1: resources[0]
          },
          gadgets: {
            1: resources[1]
          }
        });
      });
    });
  });
});