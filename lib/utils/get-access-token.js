/* @flow */
'use strict'

/**
 * Module for getting the Access Token stored after a successful login.
 * @module utils/get-access-token
 */

const userConfig = require('./user-config.js')

/**
 * Get Access Token generated after a successful login
 * @function getJWT
 * @returns {String} The Access Token generated after a successful login.
 */
function getAccessToken () /* : Promise<string | void> */ {
  return userConfig.getStore().load().then(config => config.access_token)
}

module.exports = getAccessToken
