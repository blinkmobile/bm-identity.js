/* @flow */
'use strict'

const request = require('request')
const inquirer = require('inquirer')

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
    jwt /* : string */
  ) /* : Promise<string> */ {
    return userConfig.getStore().update((config) => {
      config.accessToken = jwt
      return config
    }).then(() => jwt)
  }

  /**
   * Request a JWT via login. This will internally store the JWT as well.
   * @param {String} username - The username to login with.
   * @param {String} password - The password to login with.
   * @param {String} connection - The connection to use. E.g. 'Username-Password-Authentication', 'sms' or 'email'.
   * @returns {String} The JWT generated after a successful login.
   */
  requestJWT (
    username /* : string */,
    password /* : string */,
    connection /* : string */
  ) /* : Promise<string> */ {
    return new Promise((resolve, reject) => {
      request.post(`${constants.AUTH0_URL}/oauth/ro`, {
        json: {
          client_id: (privateVars.get(this) || {}).clientId,
          scope: 'openid refreshIdTokenBeforeSeconds serviceSettingsUrl',
          grant_type: 'password',
          connection: connection,
          username: username,
          password: password
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

        resolve(this.storeJWT(body.id_token))
      })
    })
  }

  /**
   * Prompt for a verification code to login. This will internally request and store the JWT as well.
   * @param {String} message - The message to display in the prompt.
   * @param {String} username - The username to login with.
   * @param {String} connection - The connection to use. E.g. 'sms' or 'email'.
   * @returns {String} The JWT generated after a successful login.
   */
  promptForCode (
    message /* : string */,
    username /* : string */,
    connection /* : string */
  ) /* : Promise<string> */ {
    // Wait for user to input verification code.
    const questions = [{
      type: 'input',
      name: 'code',
      message: message
    }]

    return inquirer.prompt(questions).then(results => {
      if (!results.code) {
        return Promise.reject(new Error('Verification code was not specified.'))
      }
      // Use code to login.
      return this.requestJWT(username, results.code, connection)
    })
  }
}

module.exports = LoginProviderBase
