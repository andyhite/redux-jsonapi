'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserialize = exports.serialize = undefined;

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

var _deserialize = require('./deserialize');

var _deserialize2 = _interopRequireDefault(_deserialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.serialize = _serialize2.default;
exports.deserialize = _deserialize2.default;