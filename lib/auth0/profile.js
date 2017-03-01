'use strict'

/**
 * Module for getting the Auth0 profile for the current user.
 * @module auth0/profile
 */

const request = require('request')

const auth0ClientFactory = require('./client-factory.js')
const verifyJWT = require('./verify-jwt.js')
const getJwt = require('../utils/get-jwt.js')
const constants = require('../constants.js')

/**
 * Get the Auth0 profile for the current user using a valid JWT.
 * @function getByJWT
 * @param {String} jwt - The JWT generated after a successful login.
 * @returns {Object} The Auth0 profile.
 */
function getByJWT (jwt) {
  if (!jwt) {
    return Promise.reject(new Error('Unauthenticated, please login before using this service.'))
  }
  return new Promise((resolve, reject) => {
    request.post(constants.AUTH0_URL + '/tokeninfo', {
      json: {
        id_token: jwt
      }
    }, (err, status, profile) => {
      if (err) {
        reject(err)
        return
      }

      if (profile === 'Unauthorized') {
        reject(new Error('Unauthorised, your access token may have expired. Please login again.'))
        return
      }

      resolve(profile)
    })
  })
}

/**
 * Get the Auth0 profile for the current user using a client.
 * @function getByClient
 * @param {String} clientName - The name of a Client.
 * @returns {Object} The Auth0 profile.
 */
function getByClient (clientName) {
  const promises = [
    getJwt(clientName),
    auth0ClientFactory.getClientIdByName(clientName)
  ]
  return Promise.all(promises)
    .then(results => verifyJWT(results[0], results[1]))
    .then(jwt => getByJWT(jwt))
}

module.exports = {
  getByJWT,
  getByClient
}
