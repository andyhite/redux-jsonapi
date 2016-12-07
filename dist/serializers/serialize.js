'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends5 = require('babel-runtime/helpers/extends');

var _extends6 = _interopRequireDefault(_extends5);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _humps = require('humps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serializeRelationships() {
  var resources = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return resources.map(function (resource) {
    return serializeRelationship(resource);
  });
}

function serializeRelationship() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      id = _ref.id,
      _type = _ref._type;

  return { id: id, type: _type };
}

function serialize(_ref2) {
  var id = _ref2.id,
      _type = _ref2._type,
      _meta = _ref2._meta,
      otherAttributes = (0, _objectWithoutProperties3.default)(_ref2, ['id', '_type', '_meta']);

  var resource = {};

  if (id) resource = (0, _extends6.default)({}, resource, { id: id });
  resource = (0, _extends6.default)({}, resource, { type: _type });

  resource = (0, _keys2.default)(otherAttributes).reduce(function (resource, key) {
    if (typeof otherAttributes[key] === 'function') {
      var data = otherAttributes[key].call();

      if (Array.isArray(data)) {
        return (0, _extends6.default)({}, resource, {
          relationships: (0, _extends6.default)({}, resource.relationships, (0, _defineProperty3.default)({}, (0, _humps.decamelize)(key), {
            data: serializeRelationships(data)
          }))
        });
      }

      return (0, _extends6.default)({}, resource, {
        relationships: (0, _extends6.default)({}, resource.relationships, (0, _defineProperty3.default)({}, (0, _humps.decamelize)(key), {
          data: data && serializeRelationship(data)
        }))
      });
    }

    return (0, _extends6.default)({}, resource, {
      attributes: (0, _extends6.default)({}, resource.attributes, (0, _defineProperty3.default)({}, (0, _humps.decamelize)(key), otherAttributes[key]))
    });
  }, resource);

  if (_meta) resource = (0, _extends6.default)({}, resource, { meta: _meta });

  return resource;
}

exports.default = serialize;