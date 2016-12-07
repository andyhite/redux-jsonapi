'use strict';

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Serialize', function () {
  var serializedResource = {
    id: 1,
    _type: 'widgets',
    name: 'Widget #1',
    gadgets: function gadgets() {
      return [{ id: 1, _type: 'gadgets', name: 'Gadget #1' }, { id: 2, _type: 'gadgets', name: 'Gadget #2' }];
    },
    doodad: function doodad() {
      return { id: 1, _type: 'doodads', name: 'Doodad #1' };
    },
    somethingNull: function somethingNull() {
      return null;
    }
  };

  it('sets the resource ID', function () {
    expect((0, _serialize2.default)(serializedResource).id).toEqual(1);
  });

  it('sets the resource type', function () {
    expect((0, _serialize2.default)(serializedResource).type).toEqual('widgets');
  });

  it('sets the resource attributes', function () {
    expect((0, _serialize2.default)(serializedResource).attributes.name).toEqual('Widget #1');
  });

  it('sets the resource relationships', function () {
    expect((0, _serialize2.default)(serializedResource).relationships.gadgets.data[0].id).toEqual(1);
    expect((0, _serialize2.default)(serializedResource).relationships.gadgets.data[0].type).toEqual('gadgets');
    expect((0, _serialize2.default)(serializedResource).relationships.gadgets.data[1].id).toEqual(2);
    expect((0, _serialize2.default)(serializedResource).relationships.gadgets.data[1].type).toEqual('gadgets');
    expect((0, _serialize2.default)(serializedResource).relationships.doodad.data.id).toEqual(1);
    expect((0, _serialize2.default)(serializedResource).relationships.doodad.data.type).toEqual('doodads');
    expect((0, _serialize2.default)(serializedResource).relationships.somethingNull).toEqual(undefined);
  });
});