/* @flow */
'use strict'

const jwt = require('jsonwebtoken')

const login = require('./lib/common/login.js')
const logout = require('./lib/common/logout.js')
const verifyJWT = require('./lib/utils/verify-jwt.js')
const getJWT = require('./lib/utils/get-jwt.js')

/**
 * Class representing a Blink Mobile identity.
 */
class BlinkMobileIdentity {
  /**
   * Login to a client using a Blink Mobile identity.
   * @param {Object} options - The login options.
   * @returns {String} The JWT generated after a successful login.
   */
  async login(options /* : ?LoginOptions */) /* : Promise<string> */ {
    return login(options)
  }

  /**
   * Logout of the client.
   */
  async logout() /* : Promise<void> */ {
    return logout()
  }

  /**
   * Get access token generated after a successful login
   * @returns {String} The access token generated after a successful login.
   */
  async getAccessToken() /* : Promise<string> */ {
    if (process.env.BLINKM_ACCESS_KEY && process.env.BLINKM_SECRET_KEY) {
      const expiryInMS = Date.now() + 1000 * 60 * 15 // expires in 15 minutes
      return Promise.resolve(
        jwt.sign(
          {
            iss: process.env.BLINKM_ACCESS_KEY,
            exp: Math.floor(expiryInMS / 1000), // exp claim should be in seconds, not milliseconds
          },
          process.env.BLINKM_SECRET_KEY,
        ),
      )
    }
    const token = await getJWT()
    return verifyJWT(token)
  }

  async getPayload(accessToken /* : string | void */) /* : Promise<Object> */ {
    const token = accessToken || (await this.getAccessToken())
    return jwt.decode(token)
  }
}

module.exports = BlinkMobileIdentity

/* ::
export type LoginOptions = {
  password?: string,
  username?: string | true,
  storeJwt?: boolean
}

export type UserConfigStore = {
  load: () => Promise<Object>,
  update: (Object) => Promise<Object>
}
*/
