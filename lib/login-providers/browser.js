/* @flow */
'use strict'

/* ::
import type {
  Tenant
} from '../..'
*/

const querystring = require('querystring')
const crypto = require('crypto')
const request = require('request')
const inquirer = require('inquirer')
const open = require('open')

const constants = require('../constants.js')
const base64url = require('base64url').encode
const LoginProviderBase = require('./login-provider-base.js')

/**
 * Class representing a browser login provider.
 */
class BrowserLoginProvider extends LoginProviderBase {
  /**
   * Login to a client using a Blink Mobile identity with a browser login provider.
   * @returns {String} The JWT generated after a successful login.
   */
  async login(storeJwt /* : ?boolean */) /* : Promise<string> */ {
    // Generate the verifier, and the corresponding challenge
    const verifier = base64url(crypto.randomBytes(32))
    const verifierChallenge = base64url(
      crypto
        .createHash('sha256')
        .update(verifier)
        .digest(),
    )
    const qs = querystring.stringify({
      response_type: 'code',
      scope: constants.SCOPE,
      client_id: this.CONSTANTS.LOGIN_CLIENT_ID,
      redirect_uri: this.CONSTANTS.LOGIN_CALLBACK_URL,
      code_challenge: verifierChallenge,
      code_challenge_method: 'S256',
    })
    // Open a browser and initiate the authentication process with Auth0
    // The callback URL is a simple website that simply displays the OAuth2 authz code
    // User will copy the value and then paste it here for the process to complete.
    open(`${this.CONSTANTS.LOGIN_URL}/authorize?${qs}`, { wait: false })

    console.log(
      'A browser has been opened to allow you to login. Once logged in, you will be granted a verification code.',
    )

    const questions = [
      {
        type: 'input',
        name: 'code',
        message: 'Please enter the code: ',
      },
    ]

    const results = await inquirer.prompt(questions)
    const body = await new Promise((resolve, reject) => {
      request.post(
        this.CONSTANTS.LOGIN_URL + '/oauth2/token',
        {
          form: {
            code: results.code,
            code_verifier: verifier,
            client_id: this.CONSTANTS.LOGIN_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: this.CONSTANTS.LOGIN_CALLBACK_URL,
          },
          json: true,
        },
        (err, response, body) => {
          if (err) {
            reject(err)
            return
          }
          if (body.error) {
            reject(new Error(body.error_description))
            return
          }
          resolve(body)
        },
      )
    })

    if (storeJwt) {
      // Must use this.storeJWT instead of super.storeJWT to support bug in Node 4.
      await this.storeJWT(body)
    }

    return body.id_token
  }
}

module.exports = BrowserLoginProvider
