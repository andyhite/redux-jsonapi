import { decamelize } from 'humps';

function relationships(resources = []) {
  return resources.map((resource) => relationship(resource));
}

function relationship({ id, _type } = {}) {
  return { id: type: _type };
}

function serialize({ id, _type, _meta, ...otherAttributes }) {
  const resource = {};

  if (id) resource = { ...resource, id };
  resource = { ...resource, type: _type }

  resource = Object.keys(otherAttributes).reduce((resource, key) => {
    if (typeof otherAttributes[key] === 'function') {
      const data = otherAttributes[key].call();

      if (data) {
        if (Array.isArray(data)) {
          return {
            ...resource,
            relationships: {
              ...resource.relationships,
              [decamelize(key)]: {
                data: relationships(data),
              },
            },
          };
        }

        return {
          ...resource,
          relationships: {
            ...resource.relationships,
            [decamelize(key)]: {
              data: relationship(data),
            },
          },
        };
      }
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
