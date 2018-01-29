/* @flow */
'use strict'

/**
 * Module for gettin the JWT stored after a successful login.
 * @module utils/get-jwt
 */

const userConfig = require('./user-config.js')

/**
 * Get JWT generated after a successful login
 * @function getJWT
 * @returns {String} The JWT generated after a successful login.
 */
function getJWT () /* : Promise<string | void> */ {
  // Returning accessToken if id_token is not set to be backward compatible
  return userConfig.getStore().load().then(config => config.id_token || config.accessToken)
}

module.exports = getJWT
