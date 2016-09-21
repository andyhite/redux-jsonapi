require('es6-promise').polyfill();
require('isomorphic-fetch');

const fetchMock = require('fetch-mock');

fetchMock.patch = function(matcher, response, options) {
  return this.mock(matcher, response, Object.assign({}, options, { method: 'PATCH' }));
}

global.fetchMock = fetchMock;
