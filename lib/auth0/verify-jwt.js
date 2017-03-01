'use strict';

/**
 * Module for verifying a JWT.
 * @module auth0/verify-jwt
 */

const request = require('request');
const decode = require('jsonwebtoken').decode;

const userConfig = require('../utils/user-config.js');
const constants = require('../constants.js');

function isExpired (date, offsetSeconds) {
  if (!date) {
    return true;
  }
  const offsetMS = offsetSeconds ? (offsetSeconds * 1000) : 0;
  return date.getTime() < Date.now() + offsetMS;
}

/**
 * Verify a JWT, will get a new JWT if the one passed in will expire after a certain period based on configuration.
 * @function verifyJWT
 * @param {String} jwt - The jwt to verify.
 * @param {String} clientId - The Id of the client.
 * @returns {String} A JWT, will either be a new one with an extended expiry date or the same one passed in.
 */
function verifyJWT (jwt, clientId) {
  if (!jwt) {
    return Promise.reject(new Error('Unauthenticated, please login before using this service.'));
  }

  const decoded = decode(jwt);
  if (!decoded || !decoded.exp) {
    return Promise.reject(new Error('Malformed access token. Please login again.'));
  }

  // The 0 here is the key, which sets the date to the epoch
  const expiryDate = new Date(0);
  expiryDate.setUTCSeconds(decoded.exp);

  // If token has expired, return error
  if (isExpired(expiryDate)) {
    return Promise.reject(new Error('Unauthorised, your access token has expired. Please login again.'));
  }

  // If token expires after a certain time based on config,
  // get a new access token.
  if (isExpired(expiryDate, decoded.refreshIdTokenBeforeSeconds)) {
    return new Promise((resolve, reject) => {
      request.post(`${constants.AUTH0_URL}/delegation`, {
        json: {
          client_id: clientId,
          id_token: jwt,
          scope: 'passthrough',
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          api_type: 'auth0'
        }
      }, (err, status, data) => {
        if (err) {
          return reject(err);
        }
        if (data.error) {
          return reject(new Error(data.error_description));
        }

        // Store the new jwt to use next time.
        userConfig.getStore().update((config) => {
          config.accessToken = data.id_token;
          return config;
        }).then(() => resolve(data.id_token));
      });
    });
  }

  // If token has not yet expired we can continue
  return Promise.resolve(jwt);
}

module.exports = verifyJWT;
