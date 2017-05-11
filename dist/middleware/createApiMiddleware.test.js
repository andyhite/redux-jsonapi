'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _reduxMockStore = require('redux-mock-store');

var _reduxMockStore2 = _interopRequireDefault(_reduxMockStore);

var _createApiMiddleware = require('./createApiMiddleware');

var _createApiMiddleware2 = _interopRequireDefault(_createApiMiddleware);

var _api = require('../modules/api');

var apiActions = _interopRequireWildcard(_api);

var _serializers = require('../serializers');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiMiddleware = (0, _createApiMiddleware2.default)('http://example.com', {
  'Special-Header': 'value-here'
});
var middlewares = [apiMiddleware];
var mockStore = (0, _reduxMockStore2.default)(middlewares);

describe('Middleware', function () {
  var store = null;
  var action = null;

  beforeEach(function () {
    store = mockStore({});
  });
  afterEach(function () {
    fetchMock.restore();
  });

  describe('when the action is not a redux-jsonapi HTTP verb', function () {
    beforeEach(function () {
      action = { type: 'SOMETHING_UNRELATED' };
    });

    it('allows the action to continue along to the next middleware', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return store.dispatch(action);

            case 2:
              expect(store.getActions()).toEqual([action]);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));
  });

  describe('when the action is a redux-jsonapi HTTP verb', function () {
    var article = { id: 1, type: 'articles', attributes: { title: 'Something about Redux' } };

    var response = {
      data: article
    };

    describe('and there is a single resource provided', function () {
      beforeEach(function () {
        fetchMock.get('http://example.com/articles', response);
      });
      beforeEach(function () {
        action = apiActions.read([{ _type: 'articles' }]);
      });

      it('makes the request against an un-nested resource url', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return store.dispatch(action);

              case 2:
                expect(fetchMock.lastUrl()).toEqual('http://example.com/articles');

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      })));
    });

    describe('and there are multiple resources provided', function () {
      beforeEach(function () {
        fetchMock.get('http://example.com/articles/1/authors', response);
      });
      beforeEach(function () {
        action = apiActions.read([{ _type: 'articles', id: 1 }, { _type: 'authors' }]);
      });

      it('makes the request against a nested resource url', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return store.dispatch(action);

              case 2:
                expect(fetchMock.lastUrl()).toEqual('http://example.com/articles/1/authors');

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      })));
    });

    describe('and there is a formatURL option specified', function () {
      beforeEach(function () {
        fetchMock.get('http://example.com/articles/', response);
      });
      beforeEach(function () {
        action = apiActions.read({ _type: 'articles' }, { options: { formatURL: function formatURL(url) {
              return url + '/';
            } } });
      });

      it('makes the request against a nested resource url', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return store.dispatch(action);

              case 2:
                expect(fetchMock.lastUrl()).toEqual('http://example.com/articles/');

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      })));
    });

    describe('and the response is OK', function () {
      beforeEach(function () {
        fetchMock.get('http://example.com/articles', response);
      });
      beforeEach(function () {
        action = apiActions.read({ _type: 'articles' });
      });

      it('dispatches a RECEIVE action with the response data', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return store.dispatch(action);

              case 2:
                expect(store.getActions()).toContain(action);

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined);
      })));

      it('returns a promise with the data', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
        var data;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return store.dispatch(action);

              case 2:
                data = _context6.sent;

                expect(data).toEqual({ resources: [article], result: article.id, meta: {} });

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, undefined);
      })));
    });

    describe('and the response is not OK', function () {
      beforeEach(function () {
        fetchMock.get('http://example.com/articles', 500);
      });
      beforeEach(function () {
        action = apiActions.read({ _type: 'articles' });
      });

      it('throws the error with message and status code', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return store.dispatch(action);

              case 3:
                _context7.next = 9;
                break;

              case 5:
                _context7.prev = 5;
                _context7.t0 = _context7['catch'](0);

                expect(_context7.t0.message).toEqual('Internal Server Error');
                expect(_context7.t0.status).toEqual(500);

              case 9:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, undefined, [[0, 5]]);
      })));
    });
  });

  describe('when the action is a redux-jsonapi HTTP GET', function () {
    var response = {
      data: [{ id: 1, type: 'articles', attributes: { title: 'Something about Redux' } }, { id: 2, type: 'articles', attributes: { title: 'React blah blah blah' } }],
      included: [{ id: 1, type: 'authors', attributes: { firstName: 'Andrew', lastName: 'Hite' } }]
    };

    beforeEach(function () {
      fetchMock.get('http://example.com/articles', response);
    });
    beforeEach(function () {
      action = apiActions.read({ _type: 'articles' }, { headers: { 'Custom': 'header' } });
    });

    it('executes a GET request with the given payload', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return store.dispatch(action);

            case 2:
              expect(fetchMock.lastUrl()).toEqual('http://example.com/articles');
              expect(fetchMock.lastOptions()).toEqual({
                method: 'GET',
                body: undefined,
                headers: {
                  'Accept': 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json',
                  'Special-Header': 'value-here',
                  'Custom': 'header'
                }
              });

            case 4:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined);
    })));
  });

  describe('when the action is a redux-jsonapi HTTP POST', function () {
    var article = { _type: 'articles', title: 'React blah blah blah' };

    var response = {
      data: (0, _extends3.default)({ id: 2 }, (0, _serializers.serialize)(article))
    };

    beforeEach(function () {
      fetchMock.post('http://example.com/articles', response);
    });
    beforeEach(function () {
      action = apiActions.write(article);
    });

    it('executes a POST request with the given payload', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return store.dispatch(action);

            case 2:
              expect(fetchMock.lastUrl()).toEqual('http://example.com/articles');
              expect(fetchMock.lastOptions()).toEqual({
                method: 'POST',
                body: (0, _stringify2.default)({
                  data: (0, _serializers.serialize)(article)
                }),
                headers: {
                  'Accept': 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json',
                  'Special-Header': 'value-here'
                }
              });

            case 4:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, undefined);
    })));
  });

  describe('when the action is a redux-jsonapi HTTP PATCH', function () {
    var article = { _type: 'articles', id: 2, title: 'React blah blah blah' };

    var response = {
      data: (0, _serializers.serialize)(article)
    };

    beforeEach(function () {
      fetchMock.patch('http://example.com/articles/2', response);
    });
    beforeEach(function () {
      action = apiActions.write(article);
    });

    it('executes a PATCH request with the given payload', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return store.dispatch(action);

            case 2:
              expect(fetchMock.lastUrl()).toEqual('http://example.com/articles/2');
              expect(fetchMock.lastOptions()).toEqual({
                method: 'PATCH',
                body: (0, _stringify2.default)({
                  data: (0, _serializers.serialize)(article)
                }),
                headers: {
                  'Accept': 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json',
                  'Special-Header': 'value-here'
                }
              });

            case 4:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, undefined);
    })));
  });

  describe('when the action is a redux-jsonapi HTTP DELETE', function () {
    var article = { _type: 'articles', id: 2, title: 'React blah blah blah' };

    var response = {
      status: 204,
      data: null
    };

    beforeEach(function () {
      fetchMock.delete('http://example.com/articles/2', response);
    });
    beforeEach(function () {
      action = apiActions.remove(article);
    });

    it('executes a DELETE request with the given payload', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return store.dispatch(action);

            case 2:
              expect(fetchMock.lastUrl()).toEqual('http://example.com/articles/2');
              expect(fetchMock.lastOptions()).toEqual({
                method: 'DELETE',
                body: undefined,
                headers: {
                  'Accept': 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json',
                  'Special-Header': 'value-here'
                }
              });

            case 4:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, undefined);
    })));
  });
});