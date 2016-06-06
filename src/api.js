import humps from 'humps';

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

export function deserializeResources(resources, state) {
  return resources.map((resource) => deserializeResource(resource, state));
}

export function deserializeRelationship(resource, state) {
  return getResource(resource.type, resource.id, state);
}

export function deserializeResource(resource, state) {
  const deserializedResource = {};
  const { id, type, attributes, relationships } = resource;

  if (id) deserializedResource.id = id;
  deserializedResource._type = type;

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

  return deserializedResource;
}

export function serializeRelationship(relationship) {
  const { id, _type: type } = relationship;

  return {
    data: { id, type },
  };
}

export function serializeResource(resource) {
  const serializedResource = {};
  const { id, _type: type, ...otherAttributes } = resource;

  serializedResource.id = id;
  serializedResource.type = type;
  serializedResource.attributes = {};
  serializedResource.relationships = {};

  Object.keys(otherAttributes).forEach((key) => {
    if (typeof otherAttributes[key] === 'function') {
      const data = otherAttributes[key].call();

      if (Array.isArray(data)) {
        serializedResource.relationships[humps.decamelize(key)] = data.map((relationship) => {
          return serializeRelationship(relationship);
        });
      } else {
        serializedResource.relationships[humps.decamelize(key)] = serializeRelationship(data);
      }
    } else {
      serializedResource.attributes[humps.decamelize(key)] = otherAttributes[key];
    }
  });

  return serializedResource;
}
