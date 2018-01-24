/* @flow */
'use strict'

/**
 * Module for getting the Refresh Token stored after a successful login.
 * @module utils/get-refresh-token
 */

const userConfig = require('./user-config.js')

/**
 * Get Refresh Token generated after a successful login
 * @function getRefreshToken
 * @returns {String} The Refresh Token generated after a successful login.
 */
function getRefreshToken () /* : Promise<string | void> */ {
  return userConfig.getStore().load().then(config => config.refresh_token)
}

module.exports = getRefreshToken
