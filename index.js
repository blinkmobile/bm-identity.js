/* @flow */
'use strict'

const jwt = require('jsonwebtoken')

const loginCommon = require('./lib/common/login.js')
const logoutCommon = require('./lib/common/logout.js')
const verifyJWT = require('./lib/auth0/verify-jwt.js')
const auth0ClientFactory = require('./lib/auth0/client-factory.js')
const getJWT = require('./lib/utils/get-jwt.js')

const privateVars = new WeakMap()

/**
 * Class representing a Blink Mobile identity.
 */
class BlinkMobileIdentity {
  /**
   * Create a Blink Mobile identity.
   * @param {String} clientName - The name of the client.
   */
  constructor (
    clientName /* : string */
  ) {
    privateVars.set(this, {
      clientName
    })
  }

  /**
   * Login to a client using a Blink Mobile identity.
   * @param {Object} options - The login options.
   * @returns {String} The JWT generated after a successful login.
   */
  login (
    options /* : LoginOptions */
  ) /* : Promise<string> */ {
    return loginCommon.login((privateVars.get(this) || {}).clientName || '', options)
  }

  /**
   * Logout of the client.
   */
  logout () /* : Promise<void> */ {
    return logoutCommon.logout((privateVars.get(this) || {}).clientName)
  }

  /**
   * Get access token generated after a successful login
   * @returns {String} The access token generated after a successful login.
   */
  getAccessToken () /* : Promise<string> */ {
    if (process.env.BLINKM_ACCESS_KEY && process.env.BLINKM_SECRET_KEY) {
      const expiryInMS = Date.now() + 1000 * 60 * 15 // expires in 15 minutes
      return Promise.resolve(jwt.sign({
        iss: process.env.BLINKM_ACCESS_KEY,
        exp: Math.floor(expiryInMS / 1000) // exp claim should be in seconds, not milliseconds
      }, process.env.BLINKM_SECRET_KEY))
    }
    return Promise.all([
      getJWT(),
      auth0ClientFactory.getClientIdByName((privateVars.get(this) || {}).clientName)
    ])
      .then(([ jwt, clientId ]) => verifyJWT(jwt, clientId))
  }

  getPayload (
    accessToken /* : string | void */
  ) /* : Promise<Object> */ {
    return Promise.resolve()
      .then(() => accessToken || this.getAccessToken())
      .then((accessToken) => jwt.decode(accessToken))
  }
}

module.exports = BlinkMobileIdentity

/* ::
export type LoginOptions = {
  password?: string,
  username?: string | true,
  storeJwt?: boolean,
  refreshToken?: boolean
}

export type UserConfigStore = {
  load: () => Promise<Object>,
  update: (Object) => Promise<Object>
}
*/
