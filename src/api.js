import Immutable from 'immutable';
import humps from 'humps';

export function deserializeRelationship(resource, state) {
  if (!resource) return null;
  return getResource(resource.type, resource.id, state); // eslint-disable-line no-use-before-define
}

export function deserializeResource(resource, state) {
  const deserializedResource = {};
  const { id, type, attributes, relationships, meta } = resource;

  if (id) deserializedResource.id = id;
  deserializedResource._type = type; // eslint-disable-line no-underscore-dangle

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      deserializedResource[humps.camelize(key)] = attributes[key];
    });
  }

  if (relationships) {
    Object.keys(relationships).forEach((key) => {
      deserializedResource[humps.camelize(key)] = () => {
        if (Array.isArray(relationships[key].data)) {
          return relationships[key].data.map((data) => deserializeRelationship(data, state));
        }

        return deserializeRelationship(relationships[key].data, state);
      };
    });
  }

  if (meta) {
    deserializedResource._meta = meta; // eslint-disable-line no-underscore-dangle
  }

  return deserializedResource;
}

export function deserializeResources(resources, state) {
  return resources.map((resource) => deserializeResource(resource, state));
}

export function getMeta(resourceType, state) {
  return state.getIn(['meta', resourceType], new Immutable.Map).toJS();
}

export function getResources(resourceType, state) {
  if (!state || !state.hasIn(['resources', resourceType])) return [];
  return deserializeResources(state.getIn(['resources', resourceType]).valueSeq().toJS(), state);
}

export function getResource(resourceType, resourceId, state) {
  if (!state || !state.hasIn(['resources', resourceType, resourceId])) return null;
  return deserializeResource(state.getIn(['resources', resourceType, resourceId]).toJS(), state);
}

export function getResourceBySelector(resourceType, selector, state) {
  return getResources(resourceType, state).find(selector);
}

export function getResourcesBySelector(resourceType, selector, state) {
  return getResources(resourceType, state).filter(selector);
}

export function serializeRelationship(resource) {
  if (!resource) return null;
  const { id, _type: type } = resource;
  return { id, type };
}

export function serializeResource(resource) {
  const serializedResource = {};
  const { id, _type: type, _meta: meta, ...otherAttributes } = resource;

  if (id) {
    serializedResource.id = id;
  }

  serializedResource.type = type;
  serializedResource.attributes = {};
  serializedResource.relationships = {};

  if (meta) {
    serializedResource.meta = meta;
  }

  Object.keys(otherAttributes).forEach((key) => {
    if (typeof otherAttributes[key] === 'function') {
      const data = otherAttributes[key].call();

      if (data) {
        if (Array.isArray(data)) {
          serializedResource.relationships[humps.decamelize(key)] = {
            data: data.map((relationship) => serializeRelationship(relationship)),
          };
        } else {
          serializedResource.relationships[humps.decamelize(key)] = {
            data: serializeRelationship(data),
          };
        }
      }
    } else {
      serializedResource.attributes[humps.decamelize(key)] = otherAttributes[key];
    }
  });

  return serializedResource;
}
