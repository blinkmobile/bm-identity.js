/* @flow */
'use strict'

/**
 * Module for common logout helpers.
 * @module common/logout
 */

const request = require('request')

const auth0ClientFactory = require('../auth0/client-factory.js')
const constants = require('../constants.js')
const userConfig = require('../utils/user-config.js')

/**
 * Logout of a client.
 * @param {String} clientName - The name of a Client.
 */
function logout (
  clientName /* : string */
) /* : Promise<void> */ {
  return auth0ClientFactory.getClientIdByName(clientName).then(clientId => {
    return new Promise((resolve, reject) => {
      request.get(`${constants.AUTH0_URL}/v2/logout?client_id=${clientId}`, (err, status, body) => {
        if (err) {
          reject(err)
          return
        }

        userConfig.getStore().update(config => {
          if (config.accessToken) {
            delete config.access_token
            delete config.id_token
            delete config.refresh_token
          }
          return config
        }).then(() => resolve())
      })
    })
  })
}

module.exports = {
  logout
}
