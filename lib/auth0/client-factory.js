'use strict';
/**
 * Auth0 Client Factory.
 * @module auth0/client-factory
 */

const memoize = require('lodash.memoize');
const getAuth0Configuration = require('./configuration.js');

/**
 * @function getClientIdByName
 * @param {String} clientName - The name of a Client.
 * @returns {String} The Id of the Client.
 */
function getClientIdByName (clientName) {
  return getAuth0Configuration().then(auth0Configuration => {
    const clientId = auth0Configuration.clients[clientName];
    if (!clientId) {
      return Promise.reject(`Could not find Auth0 Client Id for Client: ${clientName}`);
    }

    return clientId;
  });
}

module.exports = {
  getClientIdByName: memoize(getClientIdByName)
};
