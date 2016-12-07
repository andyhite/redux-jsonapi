'use strict';

var _deserialize = require('./deserialize');

var _deserialize2 = _interopRequireDefault(_deserialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Deserialize', function () {
  var store = {
    widgets: {},
    gadgets: {
      1: {
        id: 1,
        type: 'gadgets',
        attributes: {
          name: 'Gadget #1'
        }
      },
      2: {
        id: 2,
        type: 'gadgets',
        attributes: {
          name: 'Gadget #2'
        }
      }
    },
    doodads: {
      1: {
        id: 1,
        type: 'doodads',
        attributes: {
          name: 'Doodad #1'
        }
      }
    }
  };

  var serializedResource = {
    id: 1,
    type: 'widgets',
    attributes: {
      name: 'Widget #1'
    },
    relationships: {
      gadgets: {
        data: [{ id: 1, type: 'gadgets' }, { id: 2, type: 'gadgets' }]
      },
      doodad: {
        data: { id: 1, type: 'doodads' }
      }
    }
  };

  it('sets the resource ID', function () {
    expect((0, _deserialize2.default)(serializedResource, store).id).toEqual(1);
  });

  it('sets the resource type', function () {
    expect((0, _deserialize2.default)(serializedResource, store)._type).toEqual('widgets');
  });

  it('sets the resource attributes', function () {
    expect((0, _deserialize2.default)(serializedResource, store).name).toEqual('Widget #1');
  });

  it('sets the resource relationships', function () {
    expect((0, _deserialize2.default)(serializedResource, store).gadgets()[0].name).toEqual('Gadget #1');
    expect((0, _deserialize2.default)(serializedResource, store).gadgets()[1].name).toEqual('Gadget #2');
    expect((0, _deserialize2.default)(serializedResource, store).doodad().name).toEqual('Doodad #1');
  });
});