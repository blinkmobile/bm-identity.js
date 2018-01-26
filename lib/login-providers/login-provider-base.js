/* @flow */
'use strict'

const request = require('request')

const constants = require('../constants.js')
const userConfig = require('../utils/user-config.js')

const privateVars = new WeakMap()

/**
 * Base class representing a login provider.
 */
class LoginProviderBase {
  /**
   * Create a base login provider.
   * @param {String} clientId - The Id of the client.
   */
  constructor (clientId /* : string */) {
    privateVars.set(this, {
      clientId
    })
  }

  /**
   * Store the JWT generated after a successful login for later use.
   * @param {String} jwt - The JWT generated after a successful login.
   * @returns {String} The JWT generated after a successful login.
   */
  storeJWT (
    body /* : Object */
  ) /* : Promise<string> */ {
    return userConfig.getStore().update((config) => {
      config.access_token = body.access_token
      config.id_token = body.id_token
      config.refresh_token = body.refresh_token
      return config
    }).then(() => body.id_token)
  }

  /**
   * Request a JWT via login. This will internally store the JWT as well.
   * @param {String} username - The username to login with.
   * @param {String} password - The password to login with.
   * @returns {String} The JWT generated after a successful login.
   */
  requestJWT (
    username /* : string */,
    password /* : string */,
    storeJwt /* : ?boolean */,
    refreshToken /* : ?boolean */
  ) /* : Promise<string> */ {
    return new Promise((resolve, reject) => {
      request.post(`${constants.AUTH0_URL}/oauth/token`, {
        json: {
          client_id: (privateVars.get(this) || {}).clientId,
          scope: constants.SCOPE + (refreshToken ? ' offline_access' : ''),
          grant_type: 'password',
          username,
          password
        }
      }, (err, status, body) => {
        if (err) {
          reject(err)
          return
        }
        if (body.error) {
          reject(new Error(body.error_description))
          return
        }

        resolve(body)
      })
    })
      .then((body) => {
        if (storeJwt) {
          // Must use this.storeJWT instead of super.storeJWT to support bug in Node 4.
          return this.storeJWT(body)
        }
        return body.id_token
      })
  }
}

module.exports = LoginProviderBase
