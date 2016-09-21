import serialize from './serialize';

describe('Serialize', () => {
  const serializedResource = {
    id: 1,
    _type: 'widgets',
    name: 'Widget #1',
    gadgets: () => {
      return [
        { id: 1, _type: 'gadgets', name: 'Gadget #1' },
        { id: 2, _type: 'gadgets', name: 'Gadget #2' },
      ];
    },
    doodad: () => {
      return { id: 1, _type: 'doodads', name: 'Doodad #1' };
    },
    somethingNull: () => {
      return null;
    },
  };

  it('sets the resource ID', () => {
    expect(serialize(serializedResource).id).toEqual(1);
  });

  it('sets the resource type', () => {
    expect(serialize(serializedResource).type).toEqual('widgets');
  });

  it('sets the resource attributes', () => {
    expect(serialize(serializedResource).attributes.name).toEqual('Widget #1');
  });

  it('sets the resource relationships', () => {
    expect(serialize(serializedResource).relationships.gadgets.data[0].id).toEqual(1);
    expect(serialize(serializedResource).relationships.gadgets.data[0].type).toEqual('gadgets');
    expect(serialize(serializedResource).relationships.gadgets.data[1].id).toEqual(2);
    expect(serialize(serializedResource).relationships.gadgets.data[1].type).toEqual('gadgets');
    expect(serialize(serializedResource).relationships.doodad.data.id).toEqual(1);
    expect(serialize(serializedResource).relationships.doodad.data.type).toEqual('doodads');
    expect(serialize(serializedResource).relationships.somethingNull).toEqual(undefined);
  });
});
