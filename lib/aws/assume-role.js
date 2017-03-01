'use strict'

/**
 * Module for assuming an AWS Role using a Blink Mobile identity.
 * @module aws/assume-role
 */

const request = require('request')

const auth0ClientFactory = require('../auth0/client-factory.js')
const verifyJWT = require('../auth0/verify-jwt.js')
const constants = require('../constants.js')
const getJwt = require('../utils/get-jwt.js')
const tenant = require('../common/tenant.js')

/**
 * Assume an temporary AWS role's credentials.
 * @function assumeRole
 * @param {String} clientName - The name of a Client.
 * @param {Object} Additional parameters to pass to the delegation endpoint.
 * @returns {Object} The AWS credentials.
 */
function assumeRole (clientName, additionalParameters) {
  return Promise.all([
    auth0ClientFactory.getClientIdByName(clientName),
    getJwt(clientName),
    tenant.get()
  ]).then((results) => {
    const clientId = results[0]
    const tenants = results[2] || {}

    return verifyJWT(results[1], clientId).then(jwt => {
      return new Promise((resolve, reject) => {
        additionalParameters = additionalParameters || {}
        additionalParameters.bmService = clientName
        additionalParameters.bmTenant = tenants.current
        request.post(`${constants.AUTH0_URL}/delegation`, {
          json: Object.assign({
            client_id: clientId,
            id_token: jwt,
            scope: 'openid',
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            api_type: 'aws'
          }, additionalParameters)
        }, (err, status, data) => {
          if (err) {
            return reject(err)
          }
          if (data.error) {
            if (data.error_description === 'jwt expired') {
              return reject(new Error('Unauthorised, your access token has expired. Please login again.'))
            }
            return reject(new Error(data.error_description))
          }

          if (data.Credentials) {
            return resolve({
              accessKeyId: data.Credentials.AccessKeyId,
              secretAccessKey: data.Credentials.SecretAccessKey,
              sessionToken: data.Credentials.SessionToken
            })
          }
          // There are some errors that are returned from AWS and not auth0
          // That are just a string sent down in the data field.
          reject(new Error(data))
        })
      })
    })
  })
}

module.exports = assumeRole
