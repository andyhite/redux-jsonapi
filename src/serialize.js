import { decamelize } from 'humps';

function serializeRelationships(resources = []) {
  return resources.map((resource) => serializeRelationship(resource));
}

function serializeRelationship({ id, _type } = {}) {
  return { id, type: _type };
}

function serialize({ id, _type, _meta, ...otherAttributes }) {
  let resource = {};

  if (id) resource = { ...resource, id };
  resource = { ...resource, type: _type }

  resource = Object.keys(otherAttributes).reduce((resource, key) => {
    if (typeof otherAttributes[key] === 'function') {
      const data = otherAttributes[key].call();

      if (Array.isArray(data)) {
        return {
          ...resource,
          relationships: {
            ...resource.relationships,
            [decamelize(key)]: {
              data: serializeRelationships(data),
            },
          },
        };
      }

      return {
        ...resource,
        relationships: {
          ...resource.relationships,
          [decamelize(key)]: {
            data: data && serializeRelationship(data),
          },
        },
      };
    }

    return {
      ...resource,
      attributes: {
        ...resource.attributes,
        [decamelize(key)]: otherAttributes[key],
      },
    };
  }, resource);

  if (_meta) resource = { ...resource, meta: _meta };

  return resource;
}

export default serialize;
