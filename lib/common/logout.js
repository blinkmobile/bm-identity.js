/* @flow */
'use strict'

/**
 * Module for common logout helpers.
 * @module common
 */

const request = require('request')

const constants = require('../constants.js')
const userConfig = require('../utils/user-config.js')

/**
 * Logout of a client.
 */
async function logout () /* : Promise<void> */ {
  await new Promise((resolve, reject) => {
    request.get(`${constants.LOGIN_URL}/logout?client_id=${constants.LOGIN_CLIENT_ID}`, (err, status, body) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  await userConfig.getStore().update(config => {
    // Removing accessToken as well as id_token to be backward compatible
    config.accessToken = undefined
    config.access_token = undefined
    config.id_token = undefined
    config.refresh_token = undefined
    return config
  })
}

module.exports = logout
