'use strict';
/**
 * Auth0 Client Factory.
 * @module auth0/configuration
 */

const memoize = require('lodash.memoize');
const request = require('request');

/**
 * @function getConfiguration
 * @returns {Object} The configuration for Auth0.
 */
function getConfiguration () {
  return new Promise((resolve, reject) => {
    request.get('https://auth-configuration.blinkm.io/auth0/configuration.json', (error, status, body) => {
      if (!error) {
        try {
          const configuration = JSON.parse(body);
          return resolve(configuration);
        } catch (err) {
          error = err;
        }
      }

      reject(new Error(`Could not find Auth0 configuration: ${error}`));
    });
  });
}

module.exports = memoize(getConfiguration);
