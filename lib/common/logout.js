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

function removeTokens () /* : Promise<string | void> */ {
  let refreshToken
  return userConfig.getStore().update(config => {
    refreshToken = config.refresh_token
    config.access_token = undefined
    config.id_token = undefined
    config.refresh_token = undefined
    return config
  })
    .then(() => refreshToken)
}

function auth0Logout (
  clientId /* : string */
) /* : Promise<void> */ {
  return new Promise((resolve, reject) => {
    request.get(`${constants.AUTH0_URL}/v2/logout?client_id=${clientId}`, (err, status, body) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function revokeRefreshToken (
  clientId /* : string */,
  refreshToken /* : string | void */
) /* : Promise<void> */ {
  if (!refreshToken) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    var options = {
      method: 'POST',
      url: `${constants.AUTH0_URL}/oauth/revoke`,
      body: {
        client_id: clientId,
        token: refreshToken
      },
      json: true
    }

    request(options, function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

/**
 * Logout of a client.
 * @param {String} clientName - The name of a Client.
 */
function logout (
  clientName /* : string */
) /* : Promise<void> */ {
  return Promise.all([
    auth0ClientFactory.getClientIdByName(clientName),
    removeTokens()
  ])
    .then(([clientId, refreshToken]) => Promise.all([
      auth0Logout(clientId),
      revokeRefreshToken(clientId, refreshToken)
    ]))
    .then(() => {})
}

module.exports = {
  logout
}
