import { camelize } from 'humps';

function deserializeRelationships(resources = [], store) {
  return resources
    .map((resource) => deserializeRelationship(resource, store))
    .filter((resource) => !!resource);
}

function deserializeRelationship(resource = {}, store) {
  if (store[camelize(resource.type)] && store[camelize(resource.type)][resource.id]) {
    return deserialize({ ...store[camelize(resource.type)][resource.id], meta: { loaded: true } }, store);
  }

  return deserialize({ ...resource, meta: { loaded: false } }, store);
}

function deserialize({ id, type, attributes, relationships, meta }, store) {
  let resource = { _type: type, _meta: meta };

  if (id) resource = { ...resource, id };

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

  return resource;
}

export default deserialize;
