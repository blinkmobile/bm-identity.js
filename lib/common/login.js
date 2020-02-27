/* @flow */
'use strict'

/**
 * Module for common login helpers.
 * @module common
 */

/* ::
import type {
  LoginOptions
} from '../..'
*/

const UsernameLoginProvider = require('../login-providers/username.js')
const BrowserLoginProvider = require('../login-providers/browser.js')

/**
 * Login to a client using a Blink Mobile identity.
 *
 * <p>The options passed to this method are optional and use login providers in the following priority based on the options passed:</p>
 * <ol>
 *  <li>username: {@link UsernameLoginProvider}</li>
 * </ol>
 *
 * @param {Object} [options={}] - The login options.
 * @param {String} [options.username] - The username.
 * @param {String} [options.password] - The password.
 * @param {String} [options.storeJwt] - Store the JWT after a successful login.
 * @returns {String} The JWT generated after a successful login.
 */
async function login(options /* : ?LoginOptions */) /* : Promise<string> */ {
  options = options || {}
  if (options.username) {
    const loginProvider = new UsernameLoginProvider()
    return loginProvider.login(
      options.username === true ? null : options.username,
      options.password,
      options.storeJwt,
    )
  } else {
    const loginProvider = new BrowserLoginProvider()
    return loginProvider.login(options.storeJwt)
  }
}

module.exports = login
