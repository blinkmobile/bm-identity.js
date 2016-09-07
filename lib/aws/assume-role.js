'use strict';

/**
 * Module for assuming an AWS Role using a Blink Mobile identity.
 * @module aws/assume-role
 */

const request = require('request');

const auth0ClientFactory = require('../auth0/client-factory.js');
const constants = require('../constants.js');
const getJwt = require('../utils/get-jwt.js');
const tenant = require('../common/tenant.js');

/**
 * Assume an temporary AWS role's credentials.
 * @function assumeRole
 * @param {String} clientName - The name of a Client.
 * @param {Object} Additional parameters to pass to the delegation endpoint.
 * @returns {Object} The AWS credentials.
 */
function assumeRole (clientName, additionalParameters) {
  return Promise.all([
    auth0ClientFactory.getClientIdByName(clientName),
    getJwt(clientName),
    tenant.get()
  ]).then((results) => {
    const clientId = results[0];
    const jwt = results[1];
    const tenants = results[2] || {};
    if (!jwt) {
      return Promise.reject('Unauthenicated, please login before using this service.');
    }

    return new Promise((resolve, reject) => {
      additionalParameters = additionalParameters || {};
      additionalParameters.bmService = clientName;
      additionalParameters.bmTenant = tenants.current;
      request.post(`${constants.AUTH0_URL}/delegation`, {
        json: Object.assign({
          client_id: clientId,
          id_token: jwt,
          scope: 'openid',
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          api_type: 'aws'
        }, additionalParameters)
      }, (err, status, data) => {
        if (err) {
          return reject(err);
        }
        if (data.error) {
          if (data.error_description === 'jwt expired') {
            return reject('Unauthorized, your access token has expired. Please login again.');
          }
          return reject(data.error_description);
        }

        resolve({
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken
        });
      });
    });
  });
}

module.exports = assumeRole;
