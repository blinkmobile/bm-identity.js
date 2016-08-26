'use strict';
/**
 * Auth0 Client Factory.
 * @module auth0-client-factory
 */

//
// TODO MC:
// This will be replaced by something more flexible in a future release.
// However, the API for this factory should not need to change.
//
const AUTH0_CLIENTS = {
  '@blinkmobile/buildbot-cli': 'ygMsfkHRV0SfP2fA2NLTIASvxnALEovh',
  '@blinkmobile/client-cli': 'KMhiBTVSWwevBd9GJsWxLyODLyEkYOCs'
};

/**
 * @function getClientIdByName
 * @param {String} clientName - The name of a Client.
 * @returns {String} The Id of the Client.
 */
function getClientIdByName (clientName) {
  return new Promise((resolve, reject) => {
    const clientId = AUTH0_CLIENTS[clientName];
    if (clientId) {
      resolve(clientId);
    } else {
      reject(`Could not find Auth0 Client Id for Client: ${clientName}`);
    }
  });
}

module.exports = {
  getClientIdByName
};
