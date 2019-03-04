/* @flow */
'use strict'

/**
 * Module for verifying a JWT.
 * @module utils
 */

const decode = require('jsonwebtoken').decode

function isExpired (
  date /* : Date */
) /* : boolean */ {
  if (!date) {
    return true
  }
  return date.getTime() < Date.now()
}

/**
 * Verify a JWT is still valid.
 * @function verifyJWT
 * @param {String} jwt - The jwt to verify.
 * @returns {String} The JWT passed in.
 */
async function verifyJWT (
  jwt /* : string | void */
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
  if (isExpired(expiryDate)) {
    return Promise.reject(new Error('Unauthorised, your access token has expired. Please login again.'))
  }

  return Promise.resolve(jwt)
}

module.exports = verifyJWT
