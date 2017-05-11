'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var handleResponse = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(response) {
    var _ref2, data, _ref2$included, included, _ref2$meta, meta;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return response.json();

          case 2:
            _ref2 = _context.sent;
            data = _ref2.data;
            _ref2$included = _ref2.included;
            included = _ref2$included === undefined ? [] : _ref2$included;
            _ref2$meta = _ref2.meta;
            meta = _ref2$meta === undefined ? {} : _ref2$meta;

            if (!data) {
              _context.next = 10;
              break;
            }

            return _context.abrupt('return', {
              resources: [].concat((0, _toConsumableArray3.default)(Array.isArray(data) ? data : [data]), (0, _toConsumableArray3.default)(included)),
              result: Array.isArray(data) ? data.map(function (r) {
                return r.id;
              }) : data.id,
              meta: meta
            });

          case 10:
            return _context.abrupt('return', {
              resources: [],
              result: null,
              meta: meta
            });

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function handleResponse(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _humps = require('humps');

var _api = require('../modules/api');

var apiActions = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDefaultHeaders() {
  return {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  };
}

function serialize(resource) {
  return (0, _stringify2.default)(resource);
}

function handleErrors(response) {
  if (!response.ok) {
    var error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }

  return response;
}

function createMiddleware(host, defaultHeaders) {
  var _this = this,
      _requestActions;

  var getURL = function getURL(resources, params) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var urlParts = [host];

    resources.forEach(function (resource) {
      var resourceAttributes = resource.attributes;

      if (resourceAttributes && resourceAttributes.meta && resourceAttributes.meta.invocation) {
        urlParts = [].concat((0, _toConsumableArray3.default)(urlParts), ['/', (0, _humps.decamelize)(resourceAttributes.meta.invocation)]);
        delete resourceAttributes.meta;
      } else if (resource.type) {
        urlParts = [].concat((0, _toConsumableArray3.default)(urlParts), ['/', (0, _humps.decamelize)(resource.type)]);
      }

      if (resource.id) urlParts = [].concat((0, _toConsumableArray3.default)(urlParts), ['/', resource.id]);
    });

    if (params) urlParts = [].concat((0, _toConsumableArray3.default)(urlParts), ['?', _qs2.default.stringify(params)]);

    if (options.formatURL) return options.formatURL(urlParts.join(''));
    return urlParts.join('');
  };

  var requestAction = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(method) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          resources = _ref4.resources,
          params = _ref4.params,
          headers = _ref4.headers,
          options = _ref4.options;

      var url, response;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              url = getURL(resources, params, options);
              _context2.next = 3;
              return fetch(url, {
                method: method,
                body: ['POST', 'PATCH'].includes(method) ? serialize({ data: resources[resources.length - 1] }) : undefined,
                headers: (0, _extends3.default)({}, getDefaultHeaders(), defaultHeaders, headers)
              });

            case 3:
              response = _context2.sent;


              response = handleErrors(response);
              response = response.status === 204 ? { resources: resources } : handleResponse(response);

              return _context2.abrupt('return', response);

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function requestAction(_x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  var requestActions = (_requestActions = {}, (0, _defineProperty3.default)(_requestActions, apiActions.GET, function (options) {
    return requestAction('GET', options);
  }), (0, _defineProperty3.default)(_requestActions, apiActions.POST, function (options) {
    return requestAction('POST', options);
  }), (0, _defineProperty3.default)(_requestActions, apiActions.PATCH, function (options) {
    return requestAction('PATCH', options);
  }), (0, _defineProperty3.default)(_requestActions, apiActions.DELETE, function (options) {
    return requestAction('DELETE', options);
  }), _requestActions);

  return function (store) {
    return function (next) {
      return function () {
        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(action) {
          var data;
          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!requestActions.hasOwnProperty(action.type)) {
                    _context3.next = 7;
                    break;
                  }

                  next(action);

                  _context3.next = 4;
                  return requestActions[action.type](action.payload);

                case 4:
                  data = _context3.sent;

                  store.dispatch(apiActions.receive(data.resources, action.type));
                  return _context3.abrupt('return', data);

                case 7:
                  return _context3.abrupt('return', next(action));

                case 8:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this);
        }));

        return function (_x5) {
          return _ref5.apply(this, arguments);
        };
      }();
    };
  };
}

exports.default = createMiddleware;