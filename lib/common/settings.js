/* @flow */
'use strict'

/**
 * Module for getting settings scoped to a BlinkMobile service.
 * @module common/settings
 */

const querystring = require('querystring')

const request = require('request')
const decode = require('jsonwebtoken').decode

const getJwt = require('../utils/get-jwt.js')
const verifyJwt = require('../auth0/verify-jwt.js')
const auth0ClientFactory = require('../auth0/client-factory.js')

/**
 * Get settings scoped to a BlinkMobile service.
 * @function settings
 * @param {String} clientName - The name of the client.
 * @param {Object} Additional parameters to pass to the settings endpoint.
 * @returns {Object} The settings.
 */
function settings (
  clientName /* : string */,
  additionalParameters /* : { [id: string]: string } | void */
) /* : Promise<any> */ {
  return Promise.all([
    getJwt(),
    auth0ClientFactory.getClientIdByName(clientName)
  ])
    .then((results) => verifyJwt(results[0], results[1]))
    .then((jwt) => {
      const decoded = decode(jwt)
      if (!decoded || !decoded.serviceSettingsUrl) {
        return Promise.reject(new Error('Malformed access token. Please login again.'))
      }

      additionalParameters = additionalParameters || {}
      additionalParameters.bmService = clientName
      const query = querystring.stringify(additionalParameters)

      return new Promise((resolve, reject) => {
        request({
          auth: { bearer: jwt },
          json: true,
          method: 'GET',
          url: `${decoded.serviceSettingsUrl}?${query}`
        }, (err, response, data) => {
          if (err) {
            return reject(err)
          }
          if (response.statusCode !== 200) {
            return reject(new Error(`Could not find Service Settings: ${data.message}`))
          }
          resolve(data)
        })
      })
    })
}

module.exports = settings
