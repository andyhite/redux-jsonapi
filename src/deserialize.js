import { camelize } from 'humps';

function relationships(resources = [], store) {
  return resources.map((resource) => relationship(resource));
}

function relationship(resource = {}, store) {
  if (!store[resource.type] || !store[resource.type][resource.id]) return null;
  return deserialize(store[resource.type][resource.id], store);
}

function deserialize({ id, type, attributes, relationships, meta }, store) {
  const resource = {};

  if (id) resource = { ...resource, id };
  resource = { ...resource, _type: type };

  if (attributes) {
    resource = Object.keys(attributes).reduce((resource, key) => {
      return { ...resource, [camelize(key)]: attributes[key] };
    }, resource);
  }

  if (relationships) {
    resource = Object.keys(relationships).reduce((resource, key) => {
      return {
        ...resource,
        [camelize(key)]: () => {
          if (Array.isArray(relationships[key].data)) {
            return relationships(relationships[key].data, store);
          } else {
            return relationship(relationships[key].data, store)
          }
        },
      };
    }, resource);
  }

  if (meta) {
    resource._meta = meta;
  }

  return resource;
}

export default deserialize;
