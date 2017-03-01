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
function getJWT () {
  return userConfig.getStore().load().then(config => config.accessToken)
}

module.exports = getJWT
