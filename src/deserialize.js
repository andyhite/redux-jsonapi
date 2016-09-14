import { camelize } from 'humps';

function deserializeRelationships(resources = [], store) {
  return resources.map((resource) => deserializeRelationship(resource, store));
}

function deserializeRelationship(resource = {}, store) {
  if (!store[resource.type] || !store[resource.type][resource.id]) return null;
  return deserialize(store[resource.type][resource.id], store);
}

function deserialize({ id, type, attributes, relationships, meta }, store) {
  let resource = {};

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
            return deserializeRelationships(relationships[key].data, store);
          } else {
            return deserializeRelationship(relationships[key].data, store)
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
