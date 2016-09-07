'use strict';

/**
 * Module for gettin the JWT stored after a successful login.
 * @module utils/get-jwt
 */

const userConfigStore = require('./user-config.js');

/**
 * Get JWT generated after a successful login
 * @function getJWT
 * @returns {String} The JWT generated after a successful login.
 */
function getJWT () {
  return userConfigStore.load().then(config => config.accessToken);
}

module.exports = getJWT;
