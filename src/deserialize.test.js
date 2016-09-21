import deserialize from './deserialize';

describe('Deserialize', () => {
  const store = {
    widgets: {},
    gadgets: {
      1: {
        id: 1,
        type: 'gadgets',
        attributes: {
          name: 'Gadget #1',
        },
      },
      2: {
        id: 2,
        type: 'gadgets',
        attributes: {
          name: 'Gadget #2',
        },
      }
    },
    doodads: {
      1: {
        id: 1,
        type: 'doodads',
        attributes: {
          name: 'Doodad #1',
        },
      }
    },
  };

  const serializedResource = {
    id: 1,
    type: 'widgets',
    attributes: {
      name: 'Widget #1',
    },
    relationships: {
      gadgets: {
        data: [
          { id: 1, type: 'gadgets' },
          { id: 2, type: 'gadgets' },
        ],
      },
      doodad: {
        data: { id: 1, type: 'doodads' },
      },
    },
  };

  it('sets the resource ID', () => {
    expect(deserialize(serializedResource, store).id).toEqual(1);
  });

  it('sets the resource type', () => {
    expect(deserialize(serializedResource, store)._type).toEqual('widgets');
  });

  it('sets the resource attributes', () => {
    expect(deserialize(serializedResource, store).name).toEqual('Widget #1');
  });

  it('sets the resource relationships', () => {
    expect(deserialize(serializedResource, store).gadgets()[0].name).toEqual('Gadget #1');
    expect(deserialize(serializedResource, store).gadgets()[1].name).toEqual('Gadget #2');
    expect(deserialize(serializedResource, store).doodad().name).toEqual('Doodad #1');
  });
});
