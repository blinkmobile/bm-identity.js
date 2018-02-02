/* @flow */
'use strict'

/**
 * Module for verifying a JWT.
 * @module auth0/verify-jwt
 */

const request = require('request')
const decode = require('jsonwebtoken').decode

const userConfig = require('../utils/user-config.js')
const getRefreshToken = require('../utils/get-refresh-token.js')
const constants = require('../constants.js')

function isExpired (
  date /* : Date */
) /* : boolean */ {
  if (!date) {
    return true
  }
  return date.getTime() < Date.now()
}

/**
 * Verify a JWT, will get a new JWT if the one passed in will expire after a certain period based on configuration.
 * @function verifyJWT
 * @param {String} jwt - The jwt to verify.
 * @param {String} clientId - The Id of the client.
 * @returns {String} A JWT, will either be a new one with an extended expiry date or the same one passed in.
 */
function verifyJWT (
  jwt /* : string | void */,
  clientId /* : string */
) /* : Promise<string> */ {
  if (!jwt) {
    return Promise.reject(new Error('Unauthenticated, please login before using this service.'))
  }

  const decoded = decode(jwt)
  if (!decoded || !decoded.exp) {
    return Promise.reject(new Error('Malformed access token. Please login again.'))
  }

  // The 0 here is the key, which sets the date to the epoch
  const expiryDate = new Date(0)
  expiryDate.setUTCSeconds(decoded.exp)

  // If token has not yet expired we can continue
  if (!isExpired(expiryDate)) {
    return Promise.resolve(jwt)
  }

  // If token has expired, refresh with refresh_token
  return getRefreshToken()
    .then((refreshToken) => {
      if (!refreshToken) {
        return Promise.reject(new Error('Unauthorised, your access token has expired. Please login again.'))
      }

      return new Promise((resolve, reject) => {
        request.post(`${constants.AUTH0_URL}/oauth/token`, {
          json: {
            client_id: clientId,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
          }
        }, (err, status, data) => {
          if (err) {
            return reject(err)
          }
          if (data.error) {
            return reject(new Error(data.error_description))
          }

          // Store the new jwt to use next time.
          userConfig.getStore().update((config) => {
            // Setting accessToken as well as id_token to be backward compatible
            config.accessToken = data.id_token
            config.id_token = data.id_token
            config.access_token = data.access_token
            return config
          }).then(() => resolve(data.id_token))
        })
      })
    })
}

module.exports = verifyJWT
