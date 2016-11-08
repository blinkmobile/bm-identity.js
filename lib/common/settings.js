'use strict';

/**
 * Module for getting settings scoped to a BlinkMobile service.
 * @module common/settings
 */

const request = require('request');
const decode = require('jsonwebtoken').decode;

const getJwt = require('../utils/get-jwt.js');

/**
 * Get settings scoped to a BlinkMobile service.
 * @function settings
 * @param {String} clientName - The name of the client.
 * @returns {Object} The settings.
 */
function settings (clientName) {
  return getJwt()
    .then((jwt) => {
      if (!jwt) {
        return Promise.reject(new Error('Unauthenticated, please login before using this service.'));
      }

      const decoded = decode(jwt);
      if (!decoded || !decoded.serviceSettingsUrl) {
        return Promise.reject(new Error('Malformed access token. Please login again.'));
      }

      return new Promise((resolve, reject) => {
        request({
          auth: { bearer: jwt },
          json: true,
          method: 'GET',
          url: `${decoded.serviceSettingsUrl}?bmService=${clientName}`
        }, (err, response, data) => {
          if (err) {
            return reject(err);
          }
          if (response.statusCode !== 200) {
            return reject(new Error(`Could not find Service Settings: ${data.message}`));
          }
          resolve(data);
        });
      });
    });
}

module.exports = settings;
